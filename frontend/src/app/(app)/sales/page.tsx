import { apiFetch } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { formatMoney, formatDate } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/shell/PageHeader";
import { StaggerGroup, StaggerItem } from "@/components/ui/Motion";
import { PosCart } from "@/components/sales/PosCart";
import { PaymentForm } from "@/components/sales/PaymentForm";
import type { Client, Debt, LedgerProduct } from "@/lib/types";

const badgeTone = { OPEN: "danger", PARTIALLY_PAID: "primary", PAID: "success" } as const;

export default async function DebtsPage() {
  const { locale, t } = await getDictionary();
  const money = (v: number | string) => formatMoney(v, locale, t.common.currency);
  const [debts, clients, products] = await Promise.all([
    apiFetch<{ items: Debt[] }>("/seller/debts"),
    apiFetch<{ items: Client[] }>("/seller/clients"),
    apiFetch<{ items: LedgerProduct[] }>("/seller/products"),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader eyebrow={t.sales.eyebrow} tone="danger" title={t.sales.title} subtitle={t.sales.subtitle} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit p-6">
          <h2 className="mb-1 text-lg font-black text-ink">{t.sales.cartTitle}</h2>
          <p className="mb-5 text-sm text-muted">{t.sales.cartSubtitle}</p>
          <PosCart clients={clients.items} products={products.items.filter((p) => p.isActive && p.stock > 0)} t={t} locale={locale} />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title={`${debts.items.length} ${t.sales.listTitle}`} subtitle={t.sales.listSubtitle} />
          {debts.items.length ? (
            <StaggerGroup className="divide-y">
              {debts.items.map((debt) => {
                const remaining = Number(debt.totalAmount) - Number(debt.paidAmount);
                return (
                  <StaggerItem key={debt.id} className="grid gap-3 px-6 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                    <div>
                      <p className="font-bold text-ink">{debt.client.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {debt.items.map((item) => `${item.product.name} × ${item.quantity}`).join(", ")} · {formatDate(debt.createdAt, locale)}
                      </p>
                    </div>
                    <div>
                      <Badge tone={badgeTone[debt.status]}>{t.status[debt.status]}</Badge>
                      <p className="mt-1 text-sm font-black text-ink">{money(remaining)}</p>
                    </div>
                    {debt.status !== "PAID" && <PaymentForm debtId={debt.id} max={remaining} t={t} />}
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          ) : (
            <EmptyState title={t.sales.empty.title} description={t.sales.empty.description} />
          )}
        </Card>
      </div>
    </div>
  );
}
