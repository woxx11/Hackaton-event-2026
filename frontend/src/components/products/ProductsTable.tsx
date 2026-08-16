"use client";

import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { LedgerProduct } from "@/lib/types";
import type { Dictionary, Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/money";
import { downloadCsv } from "@/lib/csv";

export function ProductsTable({ items, t, locale }: { items: LedgerProduct[]; t: Dictionary; locale: Locale }) {
  const [query, setQuery] = useState("");
  const money = (v: string) => formatMoney(v, locale, t.common.currency);

  const filtered = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query],
  );

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.products.searchPlaceholder}
            className="h-9 w-full rounded-xl border border-border bg-bg pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() =>
            downloadCsv(
              "products.csv",
              [t.products.table.product, t.products.table.price, t.products.table.stock],
              filtered.map((p) => [p.name, p.price, String(p.stock)]),
            )
          }
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-bold text-muted transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Download className="h-3.5 w-3.5" />
          {t.products.export}
        </button>
      </div>

      {filtered.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-bold uppercase tracking-wide text-muted">
                <th className="px-6 py-3">{t.products.table.product}</th>
                <th className="px-6 py-3 text-right">{t.products.table.price}</th>
                <th className="px-6 py-3 text-right">{t.products.table.stock}</th>
                <th className="px-6 py-3">{t.products.table.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-primary-tint/35">
                  <td className="px-6 py-4 font-semibold text-ink">{p.name}</td>
                  <td className="px-6 py-4 text-right text-muted">{money(p.price)}</td>
                  <td className="px-6 py-4 text-right font-bold text-ink">{p.stock}</td>
                  <td className="px-6 py-4">
                    <Badge tone={p.stock <= 5 ? "danger" : "success"}>{p.stock <= 5 ? t.products.lowStock : t.products.inStock}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title={t.products.empty.title} description={t.products.empty.description} />
      )}
    </div>
  );
}
