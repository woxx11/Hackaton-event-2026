"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";

export interface ActionState {
  error?: string;
}

export async function createCustomerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || undefined;
  const phone = String(formData.get("phone") ?? "").trim() || undefined;

  try {
    await apiFetch("/customers", { method: "POST", body: { name, email, phone } });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Could not create customer. Please try again." };
  }

  revalidatePath("/customers");
  return {};
}
