import { z } from "zod";
import { paginationSchema } from "@/utils/pagination";

const saleItemInputSchema = z.object({
  productVariantId: z.string().cuid(),
  quantity: z.coerce.number().int().positive(),
});

const paymentInputSchema = z.object({
  method: z.enum(["CASH", "CARD", "MOBILE", "STORE_CREDIT"]),
  amount: z.coerce.number().positive(),
});

export const createSaleSchema = z.object({
  storeId: z.string().cuid(),
  customerId: z.string().cuid().optional(),
  items: z.array(saleItemInputSchema).min(1, "A sale needs at least one item"),
  payments: z.array(paymentInputSchema).min(1, "A sale needs at least one payment"),
  notes: z.string().trim().max(1000).optional(),
});
export type CreateSaleInput = z.infer<typeof createSaleSchema>;

export const listSalesQuerySchema = paginationSchema.extend({
  storeId: z.string().cuid().optional(),
  customerId: z.string().cuid().optional(),
});
export type ListSalesQuery = z.infer<typeof listSalesQuerySchema>;

export const voidSaleSchema = z.object({
  reason: z.string().trim().min(1).max(500),
});
export type VoidSaleInput = z.infer<typeof voidSaleSchema>;
