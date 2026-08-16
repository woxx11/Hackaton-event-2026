import { z } from "zod";

export const listInventoryQuerySchema = z.object({
  storeId: z.string().cuid().optional(),
  search: z.string().trim().optional(),
  lowStockOnly: z.coerce.boolean().optional().default(false),
});
export type ListInventoryQuery = z.infer<typeof listInventoryQuerySchema>;

export const adjustInventorySchema = z.object({
  productVariantId: z.string().cuid(),
  storeId: z.string().cuid(),
  quantityDelta: z.coerce.number().int().refine((n) => n !== 0, "quantityDelta must not be 0"),
  reason: z.string().trim().min(1).max(250),
});
export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>;

export const setReorderLevelsSchema = z.object({
  reorderPoint: z.coerce.number().int().min(0),
  reorderQuantity: z.coerce.number().int().min(0),
});
export type SetReorderLevelsInput = z.infer<typeof setReorderLevelsSchema>;
