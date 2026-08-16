import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { recordAuditLog } from "@/lib/auditLog";
import type { AuthContext } from "@/types/express";
import type { AdjustInventoryInput, ListInventoryQuery, SetReorderLevelsInput } from "./inventory.schema";

export async function listInventory(auth: AuthContext, query: ListInventoryQuery) {
  const where: Prisma.InventoryWhereInput = {
    companyId: auth.companyId,
    ...(query.storeId ? { storeId: query.storeId } : {}),
    ...(query.search
      ? {
          productVariant: {
            OR: [
              { sku: { contains: query.search, mode: "insensitive" } },
              { product: { name: { contains: query.search, mode: "insensitive" } } },
            ],
          },
        }
      : {}),
  };

  const rows = await prisma.inventory.findMany({
    where,
    include: {
      productVariant: { include: { product: true } },
      store: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const withStatus = rows.map((row) => ({
    ...row,
    isLowStock: row.quantityOnHand <= row.reorderPoint,
  }));

  return query.lowStockOnly ? withStatus.filter((r) => r.isLowStock) : withStatus;
}

// Ensures every product variant has an Inventory row for its company's
// stores, so newly created products immediately show up (at 0 stock)
// instead of being invisible until someone happens to adjust them.
async function getOrCreateInventoryRow(companyId: string, productVariantId: string, storeId: string) {
  const existing = await prisma.inventory.findFirst({
    where: { productVariantId, storeId },
  });
  if (existing) return existing;
  return prisma.inventory.create({
    data: { companyId, productVariantId, storeId, quantityOnHand: 0 },
  });
}

export async function adjustInventory(auth: AuthContext, input: AdjustInventoryInput) {
  const variant = await prisma.productVariant.findFirst({
    where: { id: input.productVariantId, companyId: auth.companyId },
  });
  if (!variant) throw AppError.notFound("Product variant not found");

  const store = await prisma.store.findFirst({ where: { id: input.storeId, companyId: auth.companyId } });
  if (!store) throw AppError.notFound("Store not found");

  const inventory = await getOrCreateInventoryRow(auth.companyId, input.productVariantId, input.storeId);

  const newQuantity = inventory.quantityOnHand + input.quantityDelta;
  if (newQuantity < 0) {
    throw AppError.badRequest("Adjustment would result in negative stock", {
      current: inventory.quantityOnHand,
      requestedDelta: input.quantityDelta,
    });
  }

  const [updated] = await prisma.$transaction([
    prisma.inventory.update({ where: { id: inventory.id }, data: { quantityOnHand: newQuantity } }),
    prisma.inventoryMovement.create({
      data: {
        companyId: auth.companyId,
        productVariantId: input.productVariantId,
        storeId: input.storeId,
        type: "ADJUSTMENT",
        quantityDelta: input.quantityDelta,
        reason: input.reason,
        referenceType: "Adjustment",
        actorId: auth.userId,
      },
    }),
  ]);

  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "inventory.adjusted",
    entityType: "Inventory",
    entityId: updated.id,
    metadata: { productVariantId: input.productVariantId, storeId: input.storeId, delta: input.quantityDelta, reason: input.reason },
  });

  return updated;
}

export async function setReorderLevels(
  auth: AuthContext,
  productVariantId: string,
  storeId: string,
  input: SetReorderLevelsInput,
) {
  const variant = await prisma.productVariant.findFirst({
    where: { id: productVariantId, companyId: auth.companyId },
  });
  if (!variant) throw AppError.notFound("Product variant not found");

  const inventory = await getOrCreateInventoryRow(auth.companyId, productVariantId, storeId);
  return prisma.inventory.update({ where: { id: inventory.id }, data: input });
}

// Backend-computed low-stock + reorder recommendation. Never trust the
// client for this: it reasons over recent sales velocity, not just a
// static threshold.
export async function getReorderRecommendations(auth: AuthContext, storeId?: string) {
  const rows = await prisma.inventory.findMany({
    where: { companyId: auth.companyId, ...(storeId ? { storeId } : {}) },
    include: { productVariant: { include: { product: true } }, store: true },
  });
  const lowStock = rows.filter((row) => row.quantityOnHand <= row.reorderPoint);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const recommendations = await Promise.all(
    lowStock.map(async (row) => {
      const salesMovements = await prisma.inventoryMovement.aggregate({
        where: {
          companyId: auth.companyId,
          productVariantId: row.productVariantId,
          storeId: row.storeId,
          type: "SALE",
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { quantityDelta: true },
      });
      const unitsSoldLast30Days = Math.abs(salesMovements._sum.quantityDelta ?? 0);
      const dailyVelocity = unitsSoldLast30Days / 30;
      const daysUntilStockout = dailyVelocity > 0 ? Math.floor(row.quantityOnHand / dailyVelocity) : null;
      const suggestedReorderQuantity =
        row.reorderQuantity > 0 ? row.reorderQuantity : Math.max(Math.ceil(dailyVelocity * 14), 1);

      return {
        productVariantId: row.productVariantId,
        sku: row.productVariant.sku,
        productName: row.productVariant.product.name,
        storeId: row.storeId,
        storeName: row.store?.name ?? null,
        quantityOnHand: row.quantityOnHand,
        reorderPoint: row.reorderPoint,
        dailyVelocity: Math.round(dailyVelocity * 100) / 100,
        daysUntilStockout,
        suggestedReorderQuantity,
      };
    }),
  );

  return recommendations;
}
