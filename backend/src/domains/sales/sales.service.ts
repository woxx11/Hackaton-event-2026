import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { recordAuditLog } from "@/lib/auditLog";
import { toSkipTake, paginatedResponse } from "@/utils/pagination";
import type { AuthContext } from "@/types/express";
import type { CreateSaleInput, ListSalesQuery, VoidSaleInput } from "./sales.schema";

const saleInclude = {
  items: { include: { productVariant: { include: { product: true } } } },
  payments: true,
  customer: true,
  employee: { include: { user: true } },
  store: true,
} satisfies Prisma.SaleInclude;

export async function listSales(auth: AuthContext, query: ListSalesQuery) {
  const where: Prisma.SaleWhereInput = {
    companyId: auth.companyId,
    ...(query.storeId ? { storeId: query.storeId } : {}),
    ...(query.customerId ? { customerId: query.customerId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      include: saleInclude,
      orderBy: { createdAt: query.sortDir },
      ...toSkipTake(query),
    }),
    prisma.sale.count({ where }),
  ]);

  return paginatedResponse(items, total, query);
}

export async function getSale(auth: AuthContext, saleId: string) {
  const sale = await prisma.sale.findFirst({
    where: { id: saleId, companyId: auth.companyId },
    include: saleInclude,
  });
  if (!sale) throw AppError.notFound("Sale not found");
  return sale;
}

// Every number that ends up on the receipt is computed here, from data the
// database already trusts (ProductVariant.price), never from the request
// body. The client only says *what* and *how many* — never *for how much*.
export async function createSale(auth: AuthContext, input: CreateSaleInput) {
  const variantIds = input.items.map((i) => i.productVariantId);

  // None of these five lookups depends on another's result, so they run
  // concurrently. (This is safe because it happens before the $transaction
  // below — queries issued concurrently against a single interactive
  // transaction's connection are not safe and are deliberately avoided there.)
  const [employee, store, customer, variants, inventoryRows] = await Promise.all([
    prisma.employee.findFirst({ where: { userId: auth.userId, companyId: auth.companyId } }),
    prisma.store.findFirst({ where: { id: input.storeId, companyId: auth.companyId } }),
    input.customerId
      ? prisma.customer.findFirst({ where: { id: input.customerId, companyId: auth.companyId } })
      : Promise.resolve(null),
    prisma.productVariant.findMany({ where: { id: { in: variantIds }, companyId: auth.companyId } }),
    prisma.inventory.findMany({
      where: { productVariantId: { in: variantIds }, storeId: input.storeId, companyId: auth.companyId },
    }),
  ]);

  if (!employee) {
    throw AppError.forbidden("Your account is not linked to an employee profile that can process sales");
  }
  if (!store) throw AppError.badRequest("Invalid storeId");
  if (input.customerId && !customer) throw AppError.badRequest("Invalid customerId");
  if (variants.length !== new Set(variantIds).size) {
    throw AppError.badRequest("One or more products are invalid for this company");
  }

  const variantById = new Map(variants.map((v) => [v.id, v]));
  const inventoryByVariant = new Map(inventoryRows.map((r) => [r.productVariantId, r]));

  let subtotal = new Prisma.Decimal(0);
  const lineItems = input.items.map((item) => {
    const variant = variantById.get(item.productVariantId)!;
    const inventory = inventoryByVariant.get(item.productVariantId);
    const available = inventory?.quantityOnHand ?? 0;
    if (available < item.quantity) {
      throw AppError.badRequest(`Insufficient stock for SKU ${variant.sku}`, {
        sku: variant.sku,
        available,
        requested: item.quantity,
      });
    }
    const unitPrice = variant.price;
    const totalPrice = unitPrice.mul(item.quantity);
    subtotal = subtotal.add(totalPrice);
    return {
      productVariantId: variant.id,
      quantity: item.quantity,
      unitPrice,
      discountAmount: new Prisma.Decimal(0),
      taxAmount: new Prisma.Decimal(0),
      totalPrice,
    };
  });

  const discountTotal = new Prisma.Decimal(0);
  const taxTotal = new Prisma.Decimal(0);
  const total = subtotal.sub(discountTotal).add(taxTotal);

  const paidTotal = input.payments.reduce((sum, p) => sum.add(new Prisma.Decimal(p.amount)), new Prisma.Decimal(0));
  if (paidTotal.lt(total)) {
    throw AppError.badRequest("Payment total is less than the sale total", {
      total: total.toString(),
      paid: paidTotal.toString(),
    });
  }

  const sale = await prisma.$transaction(async (tx) => {
    const created = await tx.sale.create({
      data: {
        companyId: auth.companyId,
        storeId: input.storeId,
        customerId: input.customerId,
        employeeId: employee.id,
        subtotal,
        discountTotal,
        taxTotal,
        total,
        notes: input.notes,
        items: { create: lineItems },
        payments: { create: input.payments.map((p) => ({ method: p.method, amount: p.amount })) },
      },
      include: saleInclude,
    });

    for (const item of lineItems) {
      const inventory = inventoryByVariant.get(item.productVariantId)!;
      await tx.inventory.update({
        where: { id: inventory.id },
        data: { quantityOnHand: { decrement: item.quantity } },
      });
      await tx.inventoryMovement.create({
        data: {
          companyId: auth.companyId,
          productVariantId: item.productVariantId,
          storeId: input.storeId,
          type: "SALE",
          quantityDelta: -item.quantity,
          referenceType: "Sale",
          referenceId: created.id,
          actorId: auth.userId,
        },
      });
    }

    if (input.customerId) {
      const pointsEarned = Math.floor(Number(total));
      const loyaltyAccount = await tx.loyaltyAccount.upsert({
        where: { customerId: input.customerId },
        create: { customerId: input.customerId, points: pointsEarned },
        update: { points: { increment: pointsEarned } },
      });
      if (pointsEarned > 0) {
        await tx.loyaltyTransaction.create({
          data: {
            loyaltyAccountId: loyaltyAccount.id,
            type: "EARN",
            points: pointsEarned,
            reason: `Sale ${created.id}`,
          },
        });
      }
      await tx.customerActivity.create({
        data: {
          customerId: input.customerId,
          type: "purchase",
          description: `Purchase of ${total.toString()} at ${store.name}`,
          metadata: { saleId: created.id, total: total.toString() },
        },
      });
    }

    return created;
  });

  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "sale.created",
    entityType: "Sale",
    entityId: sale.id,
    metadata: { total: total.toString(), storeId: input.storeId, itemCount: lineItems.length },
  });

  return sale;
}

export async function voidSale(auth: AuthContext, saleId: string, input: VoidSaleInput) {
  const sale = await getSale(auth, saleId);
  if (sale.status !== "COMPLETED") {
    throw AppError.badRequest(`Sale is already ${sale.status.toLowerCase()}`);
  }

  const inventoryRows = await prisma.inventory.findMany({
    where: {
      storeId: sale.storeId,
      productVariantId: { in: sale.items.map((item) => item.productVariantId) },
    },
  });
  const inventoryByVariant = new Map(inventoryRows.map((r) => [r.productVariantId, r]));

  await prisma.$transaction(async (tx) => {
    await tx.sale.update({ where: { id: sale.id }, data: { status: "VOID" } });

    for (const item of sale.items) {
      const inventory = inventoryByVariant.get(item.productVariantId);
      if (inventory) {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantityOnHand: { increment: item.quantity } },
        });
      }
      await tx.inventoryMovement.create({
        data: {
          companyId: auth.companyId,
          productVariantId: item.productVariantId,
          storeId: sale.storeId,
          type: "RETURN",
          quantityDelta: item.quantity,
          reason: input.reason,
          referenceType: "Sale",
          referenceId: sale.id,
          actorId: auth.userId,
        },
      });
    }
  });

  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "sale.voided",
    entityType: "Sale",
    entityId: sale.id,
    metadata: { reason: input.reason },
  });

  return getSale(auth, saleId);
}
