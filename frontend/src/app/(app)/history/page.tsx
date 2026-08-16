import { apiFetch } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card } from "@/components/ui/Card";
import { HistoryFeed, type ActivityEntry } from "@/components/history/HistoryFeed";
import type { Debt } from "@/lib/types";

export default async function HistoryPage() {
  const { locale, t } = await getDictionary();
  const { items: debts } = await apiFetch<{ items: Debt[] }>("/seller/debts");

  const activity: ActivityEntry[] = [
    ...debts.map((d) => ({
      id: `debt-${d.id}`,
      type: "debt" as const,
      clientName: d.client.name,
      amount: Number(d.totalAmount),
      date: d.createdAt,
      detail: d.items.map((item) => `${item.product.name} × ${item.quantity}`).join(", "),
    })),
    ...debts.flatMap((d) =>
      d.payments.map((p) => ({
        id: `pay-${p.id}`,
        type: "payment" as const,
        clientName: d.client.name,
        amount: Number(p.amount),
        date: p.paidAt,
        detail: t.sales.title,
      })),
    ),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow={t.history.eyebrow} tone="primary" title={t.history.title} subtitle={t.history.subtitle} />
      <Card className="border-0 bg-transparent p-0 shadow-none">
        <HistoryFeed items={activity} t={t} locale={locale} currency={t.common.currency} />
      </Card>
    </div>
  );
}
