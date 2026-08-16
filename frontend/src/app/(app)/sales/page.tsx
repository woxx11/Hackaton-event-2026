import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PosTerminal } from "@/components/sales/PosTerminal";
import type { Customer, Paginated, Sale, Store } from "@/lib/types";

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
}

const STATUS_TONE = {
  COMPLETED: "success",
  VOID: "neutral",
  REFUNDED: "danger",
  PARTIALLY_REFUNDED: "danger",
} as const;

export default async function SalesPage() {
  const [stores, customers, recentSales] = await Promise.all([
    apiFetch<{ items: Store[] }>("/stores"),
    apiFetch<Paginated<Customer>>("/customers", { query: { pageSize: 100 } }),
    apiFetch<Paginated<Sale>>("/sales", { query: { pageSize: 10 } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader title="New sale" subtitle="Search products, build the cart, and take payment" />

      <PosTerminal stores={stores.items} customers={customers.items} />

      <Card>
        <CardHeader title="Recent sales" />
        {recentSales.items.length === 0 ? (
          <EmptyState title="No sales yet" description="Completed sales will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentSales.items.map((sale) => (
                  <tr key={sale.id} className="hover:bg-bg">
                    <td className="px-6 py-3">
                      <Link href={`/sales/${sale.id}`} className="font-medium text-primary hover:text-primary-hover">
                        {sale.customer?.name ?? "Walk-in customer"}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted">{new Date(sale.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <Badge tone={STATUS_TONE[sale.status]}>{sale.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-ink">{formatMoney(sale.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
