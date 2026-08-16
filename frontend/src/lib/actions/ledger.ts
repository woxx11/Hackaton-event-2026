"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/getDictionary";

export interface FormState { error?: string; success?: string }

const messageFor = (error: unknown, fallback: string) => (error instanceof ApiError ? error.message : fallback);

export async function createProductAction(_state: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getDictionary();
  try {
    await apiFetch("/seller/products", { method: "POST", body: {
      name: String(formData.get("name") ?? "").trim(),
      price: Number(formData.get("price") ?? 0),
      stock: Number(formData.get("stock") ?? 0),
    }});
    revalidatePath("/products"); revalidatePath("/dashboard");
    return { success: t.actions.productAdded };
  } catch (error) { return { error: messageFor(error, t.actions.productFailed) }; }
}

export async function createClientAction(_state: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getDictionary();
  try {
    await apiFetch("/seller/clients", { method: "POST", body: {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
    }});
    revalidatePath("/customers"); revalidatePath("/sales");
    return { success: t.actions.customerAdded };
  } catch (error) { return { error: messageFor(error, t.actions.customerFailed) }; }
}

export async function createDebtAction(_state: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getDictionary();
  const clientId = String(formData.get("clientId") ?? "");
  let items: Array<{ productId: string; quantity: number }> = [];
  try {
    const raw = JSON.parse(String(formData.get("items") ?? "[]"));
    if (Array.isArray(raw)) {
      items = raw
        .filter((row) => row && typeof row.productId === "string" && Number(row.quantity) > 0)
        .map((row) => ({ productId: row.productId, quantity: Number(row.quantity) }));
    }
  } catch {
    return { error: t.actions.cartInvalid };
  }
  if (items.length === 0) return { error: t.actions.cartEmpty };

  try {
    await apiFetch("/seller/debts", { method: "POST", body: {
      clientId, notes: String(formData.get("notes") ?? "").trim() || undefined,
      items,
    }});
    revalidatePath("/sales"); revalidatePath("/dashboard"); revalidatePath("/products"); revalidatePath("/history");
    return { success: t.actions.debtCreated };
  } catch (error) { return { error: messageFor(error, t.actions.debtFailed) }; }
}

export async function addPaymentAction(_state: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getDictionary();
  const debtId = String(formData.get("debtId") ?? "");
  try {
    await apiFetch(`/seller/debts/${debtId}/payments`, { method: "POST", body: { amount: Number(formData.get("amount") ?? 0) } });
    revalidatePath("/sales"); revalidatePath("/dashboard"); revalidatePath("/history");
    return { success: t.actions.paymentAccepted };
  } catch (error) { return { error: messageFor(error, t.actions.paymentFailed) }; }
}
