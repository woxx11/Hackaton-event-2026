import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getCurrentUser } from "@/lib/currentUser";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Paginated, Product, ReorderRecommendation, Sale } from "@/lib/types";

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [recentSales, lowStock, products] = await Promise.all([
    apiFetch<Paginated<Sale>>("/sales", { query: { pageSize: 6 } }),
    apiFetch<{ items: ReorderRecommendation[] }>("/inventory/reorder-recommendations"),
    apiFetch<Paginated<Product>>("/products", { query: { pageSize: 1 } }),
  ]);

  const todaysSales = recentSales.items.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString() && s.status === "COMPLETED",
  );
  const todaysTotal = todaysSales.reduce((sum, s) => sum + Number(s.total), 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Good to see you, {user?.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening across your store today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Sales today</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatMoney(todaysTotal)}</p>
          <p className="mt-1 text-xs text-muted">{todaysSales.length} transactions</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Needs attention</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{lowStock.items.length}</p>
          <p className="mt-1 text-xs text-muted">products low on stock</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Catalog</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{products.pagination.total}</p>
          <p className="mt-1 text-xs text-muted">products listed</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Needs attention"
            subtitle="Products below their reorder point"
            action={
              <Link href="/inventory" className="text-sm font-medium text-primary hover:text-primary-hover">
                View inventory
              </Link>
            }
          />
          {lowStock.items.length === 0 ? (
            <EmptyState title="All stocked up" description="No products are currently below their reorder point." />
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.items.slice(0, 6).map((item) => (
                <li key={`${item.productVariantId}-${item.storeId}`} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.productName}</p>
                    <p className="text-xs text-muted">{item.sku} · {item.storeName}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone="danger">{item.quantityOnHand} left</Badge>
                    {item.daysUntilStockout !== null && (
                      <p className="mt-1 text-xs text-muted">~{item.daysUntilStockout}d until stockout</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recent sales"
            action={
              <Link href="/sales" className="text-sm font-medium text-primary hover:text-primary-hover">
                Go to sales
              </Link>
            }
          />
          {recentSales.items.length === 0 ? (
            <EmptyState title="No sales yet" description="Sales you record will show up here." />
          ) : (
            <ul className="divide-y divide-border">
              {recentSales.items.map((sale) => (
                <li key={sale.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{sale.customer?.name ?? "Walk-in customer"}</p>
                    <p className="text-xs text-muted">{new Date(sale.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatMoney(sale.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
