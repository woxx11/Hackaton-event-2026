"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api";

export interface FormState { error?: string; success?: string }

const messageFor = (error: unknown, fallback: string) => error instanceof ApiError ? error.message : fallback;

export async function createProductAction(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await apiFetch("/seller/products", { method: "POST", body: {
      name: String(formData.get("name") ?? "").trim(),
      price: Number(formData.get("price") ?? 0),
      stock: Number(formData.get("stock") ?? 0),
    }});
    revalidatePath("/products"); revalidatePath("/dashboard");
    return { success: "Mahsulot qo‘shildi." };
  } catch (error) { return { error: messageFor(error, "Mahsulot qo‘shilmadi.") }; }
}

export async function createClientAction(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    await apiFetch("/seller/clients", { method: "POST", body: {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
    }});
    revalidatePath("/customers"); revalidatePath("/sales");
    return { success: "Mijoz qo‘shildi." };
  } catch (error) { return { error: messageFor(error, "Mijoz qo‘shilmadi.") }; }
}

export async function createDebtAction(_state: FormState, formData: FormData): Promise<FormState> {
  const clientId = String(formData.get("clientId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  try {
    await apiFetch("/seller/debts", { method: "POST", body: {
      clientId, notes: String(formData.get("notes") ?? "").trim() || undefined,
      items: [{ productId, quantity: Number(formData.get("quantity") ?? 0) }],
    }});
    revalidatePath("/sales"); revalidatePath("/dashboard"); revalidatePath("/products");
    return { success: "Qarz yozildi." };
  } catch (error) { return { error: messageFor(error, "Qarz yozilmadi.") }; }
}

export async function addPaymentAction(_state: FormState, formData: FormData): Promise<FormState> {
  const debtId = String(formData.get("debtId") ?? "");
  try {
    await apiFetch(`/seller/debts/${debtId}/payments`, { method: "POST", body: { amount: Number(formData.get("amount") ?? 0) } });
    revalidatePath("/sales"); revalidatePath("/dashboard");
    return { success: "To‘lov qabul qilindi." };
  } catch (error) { return { error: messageFor(error, "To‘lov qabul qilinmadi.") }; }
}
