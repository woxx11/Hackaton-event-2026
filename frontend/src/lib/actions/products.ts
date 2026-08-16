"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export interface ActionState {
  error?: string;
}

export async function createProductAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const cost = Number(formData.get("cost") ?? 0);
  const categoryId = String(formData.get("categoryId") ?? "") || undefined;
  const brandId = String(formData.get("brandId") ?? "") || undefined;

  try {
    await apiFetch("/products", {
      method: "POST",
      body: {
        name,
        categoryId,
        brandId,
        variants: [{ sku, price, cost, attributes: {} }],
      },
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not create product. Please try again." };
  }

  revalidatePath("/products");
  return {};
}

export async function createCategoryAction(name: string) {
  await apiFetch("/categories", { method: "POST", body: { name } });
  revalidatePath("/products");
}

export async function createBrandAction(name: string) {
  await apiFetch("/brands", { method: "POST", body: { name } });
  revalidatePath("/products");
}
