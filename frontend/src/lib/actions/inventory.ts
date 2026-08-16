"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export interface ActionState {
  error?: string;
}

export async function adjustInventoryAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const productVariantId = String(formData.get("productVariantId") ?? "");
  const storeId = String(formData.get("storeId") ?? "");
  const quantityDelta = Number(formData.get("quantityDelta") ?? 0);
  const reason = String(formData.get("reason") ?? "").trim();

  try {
    await apiFetch("/inventory/adjust", {
      method: "POST",
      body: { productVariantId, storeId, quantityDelta, reason },
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not adjust inventory. Please try again." };
  }

  revalidatePath("/inventory");
  return {};
}
