import Link from "next/link";
import { Wallet, PackageX, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { getCurrentUser } from "@/lib/currentUser";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { formatMoney } from "@/lib/money";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/Motion";
import { StatusDonut, TopDebtorsBar, TrendArea } from "@/components/dashboard/Charts";
import type { Client, Debt, LedgerProduct } from "@/lib/types";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const { locale, t } = await getDictionary();
  const money = (v: string | number) => formatMoney(v, locale, t.common.currency);

  const [debts, products, clients] = await Promise.all([
    apiFetch<{ items: Debt[] }>("/seller/debts"),
    apiFetch<{ items: LedgerProduct[] }>("/seller/products"),
    apiFetch<{ items: Client[] }>("/seller/clients"),
  ]);

  const openTotal = debts.items
    .filter((d) => d.status !== "PAID")
    .reduce((sum, d) => sum + Number(d.totalAmount) - Number(d.paidAmount), 0);
  const collectedTotal = debts.items.reduce((sum, d) => sum + Number(d.paidAmount), 0);
  const lowStock = products.items.filter((p) => p.stock <= 5);

  const statusCounts = { OPEN: 0, PARTIALLY_PAID: 0, PAID: 0 };
  for (const d of debts.items) statusCounts[d.status]++;
  const statusData = [
    { key: "OPEN", label: t.status.OPEN, value: statusCounts.OPEN, tone: "danger" as const },
    { key: "PARTIALLY_PAID", label: t.status.PARTIALLY_PAID, value: statusCounts.PARTIALLY_PAID, tone: "primary" as const },
    { key: "PAID", label: t.status.PAID, value: statusCounts.PAID, tone: "success" as const },
  ];

  const byClient = new Map<string, { name: string; amount: number }>();
  for (const d of debts.items) {
    if (d.status === "PAID") continue;
    const remaining = Number(d.totalAmount) - Number(d.paidAmount);
    const prev = byClient.get(d.client.id);
    byClient.set(d.client.id, { name: d.client.name, amount: (prev?.amount ?? 0) + remaining });
  }
  const topDebtors = [...byClient.values()].sort((a, b) => b.amount - a.amount).slice(0, 5);

  const days: { date: string; count: number }[] = [];
  const dayFmt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : locale === "ru" ? "ru-RU" : "uz-UZ", { day: "2-digit", month: "2-digit" });
  for (let i = 13; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const count = debts.items.filter((d) => {
      const created = new Date(d.createdAt);
      return created >= day && created < next;
    }).length;
    days.push({ date: dayFmt.format(day), count });
  }

  type Activity = { id: string; type: "debt" | "payment"; label: string; amount: number; date: string };
  const activity: Activity[] = [
    ...debts.items.map((d) => ({ id: `debt-${d.id}`, type: "debt" as const, label: d.client.name, amount: Number(d.totalAmount), date: d.createdAt })),
    ...debts.items.flatMap((d) => d.payments.map((p) => ({ id: `pay-${p.id}`, type: "payment" as const, label: d.client.name, amount: Number(p.amount), date: p.paidAt }))),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <FadeIn>
        <h1 className="text-2xl font-black tracking-tight text-ink">
          {t.dashboard.greeting}, {user?.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {user?.shopName ?? t.common.appName} {t.dashboard.subtitle}.
        </p>
      </FadeIn>

      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <StatCard icon={Wallet} tone="danger" label={t.dashboard.kpi.openDebt} value={money(openTotal)} hint={t.dashboard.kpi.openDebtHint} />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon={TrendingUp} tone="success" label={t.dashboard.kpi.collected} value={money(collectedTotal)} hint={t.dashboard.kpi.collectedHint} />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon={PackageX} tone="primary" label={t.dashboard.kpi.lowStock} value={String(lowStock.length)} hint={t.dashboard.kpi.lowStockHint} />
        </StaggerItem>
        <StaggerItem>
          <StatCard icon={Users} tone="ink" label={t.dashboard.kpi.clients} value={String(clients.items.length)} hint={t.dashboard.kpi.clientsHint} />
        </StaggerItem>
      </StaggerGroup>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FadeIn delay={0.1} className="lg:col-span-1">
          <Card className="h-full p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">{t.dashboard.charts.statusTitle}</h2>
            {debts.items.length ? <StatusDonut data={statusData} /> : <p className="text-sm text-muted">{t.dashboard.charts.empty}</p>}
          </Card>
        </FadeIn>
        <FadeIn delay={0.15} className="lg:col-span-1">
          <Card className="h-full p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">{t.dashboard.charts.topClientsTitle}</h2>
            {topDebtors.length ? <TopDebtorsBar data={topDebtors} /> : <p className="text-sm text-muted">{t.dashboard.charts.empty}</p>}
          </Card>
        </FadeIn>
        <FadeIn delay={0.2} className="lg:col-span-1">
          <Card className="h-full p-6">
            <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted">{t.dashboard.charts.trendTitle}</h2>
            <p className="mb-2 text-xs text-muted">{t.dashboard.charts.trendSubtitle}</p>
            <TrendArea data={days} />
          </Card>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t.dashboard.attention.title} subtitle={t.dashboard.attention.subtitle} />
          {lowStock.length === 0 ? (
            <EmptyState title={t.products.empty.title} description={t.products.empty.description} />
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.slice(0, 6).map((item) => (
                <li key={item.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-muted">{money(item.price)}</p>
                  </div>
                  <Badge tone="danger">{item.stock}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title={t.dashboard.activity.title}
            action={
              <Link href="/history" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                {t.dashboard.activity.viewAll} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {activity.length === 0 ? (
            <EmptyState title={t.sales.empty.title} description={t.sales.empty.description} />
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <p className="text-xs text-muted">{new Date(item.date).toLocaleDateString(locale === "en" ? "en-US" : locale === "ru" ? "ru-RU" : "uz-UZ")}</p>
                  </div>
                  <p className={`text-sm font-bold ${item.type === "payment" ? "text-success" : "text-ink"}`}>
                    {item.type === "payment" ? "+" : ""}
                    {money(item.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
