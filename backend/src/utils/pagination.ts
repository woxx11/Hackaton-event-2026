import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});
export type PaginationInput = z.infer<typeof paginationSchema>;

export function toSkipTake(input: Pick<PaginationInput, "page" | "pageSize">) {
  return { skip: (input.page - 1) * input.pageSize, take: input.pageSize };
}

export function paginatedResponse<T>(items: T[], total: number, input: PaginationInput) {
  return {
    items,
    pagination: {
      page: input.page,
      pageSize: input.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.pageSize)),
    },
  };
}
