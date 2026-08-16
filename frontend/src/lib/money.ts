import type { Locale } from "./i18n/config";

const intlLocale: Record<Locale, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };

export function formatMoney(value: string | number, locale: Locale, currencyLabel: string) {
  return `${new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 0 }).format(Number(value))} ${currencyLabel}`;
}

export function formatDate(value: string | Date, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value),
  );
}

export function formatDateTime(value: string | Date, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
