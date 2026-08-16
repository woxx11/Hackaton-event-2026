"use client";

import { useRef, useState } from "react";
import { Languages } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { setLocaleAction } from "@/lib/actions/locale";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { clsx } from "@/lib/clsx";
import { useClickOutside } from "@/lib/useClickOutside";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm font-semibold text-ink transition-colors hover:border-primary/40 hover:text-primary"
        aria-label="Change language"
      >
        <Languages className="h-4 w-4" />
        <span>{localeMeta[locale].flag}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-xl shadow-ink/10"
          >
            {locales.map((code) => (
              <form key={code} action={setLocaleAction}>
                <input type="hidden" name="locale" value={code} />
                <button
                  type="submit"
                  className={clsx(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                    code === locale ? "bg-primary-tint text-primary" : "text-ink hover:bg-bg",
                  )}
                >
                  <span className="text-base">{localeMeta[code].flag}</span>
                  {localeMeta[code].label}
                </button>
              </form>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
