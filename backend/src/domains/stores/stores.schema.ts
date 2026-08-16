import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((v) => v.toUpperCase()),
  address: z.string().trim().max(250).optional(),
  phone: z.string().trim().max(40).optional(),
  timezone: z.string().trim().max(60).optional(),
});
export type CreateStoreInput = z.infer<typeof createStoreSchema>;

export const updateStoreSchema = createStoreSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
