import { z } from "zod";

export const updateCompanySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
