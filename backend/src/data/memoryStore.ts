import { randomUUID } from "crypto";
import { Prisma, type DebtStatus } from "@prisma/client";

export type SellerRecord = { id: string; phone: string; passwordHash: string; name: string; shopName: string | null; createdAt: Date; updatedAt: Date };
export type ClientRecord = { id: string; phone: string; passwordHash: string | null; name: string; createdAt: Date; updatedAt: Date };
export type ProductRecord = { id: string; sellerId: string; name: string; price: Prisma.Decimal; stock: number; isActive: boolean; createdAt: Date; updatedAt: Date };
export type DebtItemRecord = { id: string; debtId: string; productId: string; quantity: number; unitPrice: Prisma.Decimal; totalPrice: Prisma.Decimal };
export type PaymentRecord = { id: string; debtId: string; amount: Prisma.Decimal; paidAt: Date };
export type DebtRecord = { id: string; sellerId: string; clientId: string; totalAmount: Prisma.Decimal; paidAmount: Prisma.Decimal; status: DebtStatus; notes: string | null; createdAt: Date; updatedAt: Date };

export const memory = { sellers: [] as SellerRecord[], clients: [] as ClientRecord[], products: [] as ProductRecord[], links: [] as { sellerId: string; clientId: string; createdAt: Date }[], debts: [] as DebtRecord[], items: [] as DebtItemRecord[], payments: [] as PaymentRecord[] };
export const id = () => randomUUID();
export const now = () => new Date();
