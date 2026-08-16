"use client";

import { useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { StaggerGroup, StaggerItem } from "@/components/ui/Motion";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Dictionary, Locale } from "@/lib/i18n/config";

export interface ActivityEntry {
  id: string;
  type: "debt" | "payment";
  clientName: string;
  amount: number;
  date: string;
  detail: string;
}

const intlLocale: Record<Locale, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };

export function HistoryFeed({ items, t, locale, currency }: { items: ActivityEntry[]; t: Dictionary; locale: Locale; currency: string }) {
  const [filter, setFilter] = useState<"all" | "debt" | "payment">("all");
  const money = (v: number) => `${new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 0 }).format(v)} ${currency}`;
  const dateFmt = new Intl.DateTimeFormat(intlLocale[locale], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const filtered = useMemo(() => (filter === "all" ? items : items.filter((i) => i.type === filter)), [items, filter]);

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: "all", label: t.history.filters.all },
    { key: "debt", label: t.history.filters.debts },
    { key: "payment", label: t.history.filters.payments },
  ];

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              filter === tab.key ? "bg-primary text-white shadow-sm" : "bg-surface text-muted hover:text-ink border border-border",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t.history.empty.title} description={t.history.empty.description} />
      ) : (
        <StaggerGroup className="space-y-2.5">
          {filtered.map((item) => (
            <StaggerItem key={item.id}>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
                <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", item.type === "payment" ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
                  {item.type === "payment" ? <ArrowDownCircle className="h-5 w-5" /> : <ArrowUpCircle className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">
                    {item.type === "payment" ? t.history.paymentReceived : t.history.debtCreated} {item.clientName}
                  </p>
                  <p className="text-xs text-muted">
                    {item.detail} · {dateFmt.format(new Date(item.date))}
                  </p>
                </div>
                <p className={clsx("shrink-0 text-sm font-black", item.type === "payment" ? "text-success" : "text-ink")}>
                  {item.type === "payment" ? "+" : ""}
                  {money(item.amount)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
