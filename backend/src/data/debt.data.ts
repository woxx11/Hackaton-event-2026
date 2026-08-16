import { Prisma, type DebtStatus } from "@prisma/client";
import { prisma } from "./prismaClient.js";

export const debtInclude = {
  items: { include: { product: true } },
  payments: { orderBy: { paidAt: "desc" } },
  client: true,
  seller: true,
} satisfies Prisma.DebtInclude;

export interface DebtItemInput {
  productId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
}

// Creates the debt + its line items and decrements product stock in one
// transaction, so a crash partway through can never leave stock adjusted
// without a matching debt record (or vice versa).
export async function createDebtWithItems(input: {
  sellerId: string;
  clientId: string;
  totalAmount: Prisma.Decimal;
  notes?: string;
  items: DebtItemInput[];
}) {
  return prisma.$transaction(async (tx) => {
    const debt = await tx.debt.create({
      data: {
        sellerId: input.sellerId,
        clientId: input.clientId,
        totalAmount: input.totalAmount,
        notes: input.notes,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: debtInclude,
    });

    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return debt;
  });
}

export function listDebtsForSeller(
  sellerId: string,
  filters: { clientId?: string; status?: DebtStatus },
) {
  return prisma.debt.findMany({
    where: {
      sellerId,
      ...(filters.clientId ? { clientId: filters.clientId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    include: debtInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function listDebtsForClient(clientId: string) {
  return prisma.debt.findMany({
    where: { clientId },
    include: debtInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function findDebtById(id: string) {
  return prisma.debt.findUnique({ where: { id }, include: debtInclude });
}

export async function addDebtPayment(debtId: string, amount: Prisma.Decimal) {
  return prisma.$transaction(async (tx) => {
    const debt = await tx.debt.findUniqueOrThrow({ where: { id: debtId } });
    const newPaidAmount = debt.paidAmount.add(amount);
    const status = newPaidAmount.gte(debt.totalAmount) ? "PAID" : "PARTIALLY_PAID";

    await tx.debtPayment.create({ data: { debtId, amount } });
    return tx.debt.update({
      where: { id: debtId },
      data: { paidAmount: newPaidAmount, status },
      include: debtInclude,
    });
  });
}
