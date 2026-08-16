import { apiFetch } from "./api";
import type { Seller } from "./types";

export async function getCurrentUser(): Promise<Seller | null> {
  try {
    return await apiFetch<Seller>("/seller/me");
  } catch {
    return null;
  }
}
