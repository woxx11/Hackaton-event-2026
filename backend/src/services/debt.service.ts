import { Prisma, type DebtStatus } from "@prisma/client";
import { AppError } from "../utils/AppError.js";
import * as debtData from "../data/debt.data.js";
import * as productData from "../data/product.data.js";
import * as clientData from "../data/client.data.js";

export interface CreateDebtInput {
  clientId: string;
  items: Array<{ productId: string; quantity: number }>;
  notes?: string;
}

// Every amount on a debt is computed here from the seller's own product
// prices — never trusted from the request body — so a client (or a bug in
// the frontend) can never inflate or deflate what's actually owed.
export async function createDebt(sellerId: string, input: CreateDebtInput) {
  const link = await clientData.findSellerClientLink(sellerId, input.clientId);
  if (!link) throw AppError.badRequest("Bu mijoz sizning ro'yxatingizda emas");

  const productIds = input.items.map((i) => i.productId);
  const products = await productData.findProductsByIdsForSeller(productIds, sellerId);
  if (products.length !== new Set(productIds).size) {
    throw AppError.badRequest("Ba'zi mahsulotlar topilmadi");
  }
  const productById = new Map(products.map((p) => [p.id, p]));

  let totalAmount = new Prisma.Decimal(0);
  const items = input.items.map((item) => {
    const product = productById.get(item.productId)!;
    if (product.stock < item.quantity) {
      throw AppError.badRequest(`"${product.name}" mahsuloti yetarli emas`, {
        product: product.name,
        available: product.stock,
        requested: item.quantity,
      });
    }
    const totalPrice = product.price.mul(item.quantity);
    totalAmount = totalAmount.add(totalPrice);
    return { productId: product.id, quantity: item.quantity, unitPrice: product.price, totalPrice };
  });

  return debtData.createDebtWithItems({
    sellerId,
    clientId: input.clientId,
    totalAmount,
    notes: input.notes,
    items,
  });
}

export function listDebtsForSeller(sellerId: string, filters: { clientId?: string; status?: DebtStatus }) {
  return debtData.listDebtsForSeller(sellerId, filters);
}

export function listDebtsForClient(clientId: string) {
  return debtData.listDebtsForClient(clientId);
}

export async function getDebtForSeller(sellerId: string, debtId: string) {
  const debt = await debtData.findDebtById(debtId);
  if (!debt || debt.sellerId !== sellerId) throw AppError.notFound("Qarz topilmadi");
  return debt;
}

export async function getDebtForClient(clientId: string, debtId: string) {
  const debt = await debtData.findDebtById(debtId);
  if (!debt || debt.clientId !== clientId) throw AppError.notFound("Qarz topilmadi");
  return debt;
}

export async function addPayment(sellerId: string, debtId: string, amount: number) {
  const debt = await getDebtForSeller(sellerId, debtId);
  if (debt.status === "PAID") throw AppError.badRequest("Bu qarz allaqachon to'langan");

  const amountDecimal = new Prisma.Decimal(amount);
  const remaining = debt.totalAmount.sub(debt.paidAmount);
  if (amountDecimal.gt(remaining)) {
    throw AppError.badRequest("To'lov summasi qolgan qarzdan katta bo'lishi mumkin emas", {
      remaining: remaining.toString(),
    });
  }

  return debtData.addDebtPayment(debtId, amountDecimal);
}
