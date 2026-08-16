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
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const result = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
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
  const companyName = String(formData.get("companyName") ?? "");
  const storeName = String(formData.get("storeName") ?? "Main Store");
  const ownerName = String(formData.get("ownerName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const result = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: { companyName, storeName, ownerName, email, password },
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
