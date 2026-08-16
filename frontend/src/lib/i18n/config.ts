import en from "./dictionaries/en";
import ru from "./dictionaries/ru";
import uz from "./dictionaries/uz";
import type { DictionaryShape } from "./dictionaries/shape";

export const dictionaries = { uz, ru, en };
export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = DictionaryShape;

export const localeMeta: Record<Locale, { label: string; flag: string }> = {
  uz: { label: "O‘zbekcha", flag: "🇺🇿" },
  ru: { label: "Русский", flag: "🇷🇺" },
  en: { label: "English", flag: "🇬🇧" },
};

export const defaultLocale: Locale = "uz";
export const LOCALE_COOKIE = "hisobim_locale";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
