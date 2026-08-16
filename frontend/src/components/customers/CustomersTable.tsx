"use client";

import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Client } from "@/lib/types";
import type { Dictionary, Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/money";
import { downloadCsv } from "@/lib/csv";

export function CustomersTable({ items, t, locale }: { items: Client[]; t: Dictionary; locale: Locale }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [items, query]);

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.customers.searchPlaceholder}
            className="h-9 w-full rounded-xl border border-border bg-bg pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() =>
            downloadCsv(
              "customers.csv",
              [t.customers.table.customer, t.customers.table.phone, t.customers.table.joined],
              filtered.map((c) => [c.name, c.phone, formatDate(c.createdAt, locale)]),
            )
          }
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-bold text-muted transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Download className="h-3.5 w-3.5" />
          {t.customers.export}
        </button>
      </div>

      {filtered.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-bold uppercase tracking-wide text-muted">
                <th className="px-6 py-3">{t.customers.table.customer}</th>
                <th className="px-6 py-3">{t.customers.table.phone}</th>
                <th className="px-6 py-3">{t.customers.table.joined}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-primary-tint/35">
                  <td className="px-6 py-4 font-semibold text-ink">{client.name}</td>
                  <td className="px-6 py-4 text-muted">{client.phone}</td>
                  <td className="px-6 py-4 text-muted">{formatDate(client.createdAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title={t.customers.empty.title} description={t.customers.empty.description} />
      )}
    </div>
  );
}
