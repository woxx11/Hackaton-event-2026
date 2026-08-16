"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n/config";

export async function setLocaleAction(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  if (isLocale(value)) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, value, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  const referer = (await headers()).get("referer");
  redirect(referer && referer.startsWith("http") ? referer : "/dashboard");
}
