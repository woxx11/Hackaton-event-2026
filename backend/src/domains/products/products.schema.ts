import { z } from "zod";
import { paginationSchema } from "@/utils/pagination";

export const listProductsQuerySchema = paginationSchema.extend({
  categoryId: z.string().cuid().optional(),
  brandId: z.string().cuid().optional(),
});
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

const variantInputSchema = z.object({
  sku: z.string().trim().min(1).max(60),
  barcode: z.string().trim().max(60).optional(),
  name: z.string().trim().max(120).optional(),
  attributes: z.record(z.string(), z.string()).default({}),
  price: z.coerce.number().nonnegative(),
  cost: z.coerce.number().nonnegative(),
});
export type VariantInput = z.infer<typeof variantInputSchema>;

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  categoryId: z.string().cuid().optional(),
  brandId: z.string().cuid().optional(),
  variants: z.array(variantInputSchema).min(1, "At least one variant is required"),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  categoryId: z.string().cuid().nullable().optional(),
  brandId: z.string().cuid().nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const addVariantSchema = variantInputSchema;

export const updateVariantSchema = variantInputSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  parentId: z.string().cuid().optional(),
});

export const createBrandSchema = z.object({
  name: z.string().trim().min(1).max(120),
});
