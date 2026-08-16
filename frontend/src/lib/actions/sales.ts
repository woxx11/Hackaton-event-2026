"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";
import type { Product, Sale } from "@/lib/types";

export interface CreateSaleInput {
  storeId: string;
  customerId?: string;
  items: Array<{ productVariantId: string; quantity: number }>;
  payments: Array<{ method: "CASH" | "CARD" | "MOBILE" | "STORE_CREDIT"; amount: number }>;
}

export interface CreateSaleResult {
  sale?: Sale;
  error?: string;
}

export async function createSaleAction(input: CreateSaleInput): Promise<CreateSaleResult> {
  try {
    const sale = await apiFetch<Sale>("/sales", { method: "POST", body: input });
    revalidatePath("/sales");
    revalidatePath("/inventory");
    return { sale };
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not complete the sale. Please try again." };
  }
}

export async function searchProductsAction(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const result = await apiFetch<{ items: Product[] }>("/products", {
    query: { search: query, pageSize: 8 },
  });
  return result.items;
}
