"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { setToken, clearToken } from "@/lib/session";

export interface AuthFormState {
  error?: string;
}

interface AuthResponse {
  token: string;
}

export async function loginAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const result = await apiFetch<AuthResponse>("/seller/auth/login", {
      method: "POST",
      body: { phone, password },
    });
    await setToken(result.token);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

export async function registerCompanyAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "");
  const shopName = String(formData.get("shopName") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const result = await apiFetch<AuthResponse>("/seller/auth/register", {
      method: "POST",
      body: { name, shopName, phone, password },
    });
    await setToken(result.token);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearToken();
  redirect("/login");
}
