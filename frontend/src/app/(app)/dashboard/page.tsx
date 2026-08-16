import { apiFetch } from "@/lib/api";
import { getCurrentUser } from "@/lib/currentUser";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Client, Debt, LedgerProduct } from "@/lib/types";

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(Number(value)) + " so‘m";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [debts, products, clients] = await Promise.all([
    apiFetch<{ items: Debt[] }>("/seller/debts"),
    apiFetch<{ items: LedgerProduct[] }>("/seller/products"),
    apiFetch<{ items: Client[] }>("/seller/clients"),
  ]);
  const openTotal = debts.items.filter((debt) => debt.status !== "PAID").reduce((sum, debt) => sum + Number(debt.totalAmount) - Number(debt.paidAmount), 0);
  const lowStock = products.items.filter((product) => product.stock <= 5);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Assalomu alaykum, {user?.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted">{user?.shopName ?? "Do‘koningiz"} bo‘yicha bugungi holat.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Qolgan qarz</p>
          <p className="mt-2 text-2xl font-black text-danger">{formatMoney(openTotal)}</p>
          <p className="mt-1 text-xs text-muted">faol qarzdorlik</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Kam qolgan</p>
          <p className="mt-2 text-2xl font-black text-ink">{lowStock.length}</p>
          <p className="mt-1 text-xs text-muted">5 tadan kam mahsulot</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Mijozlar</p>
          <p className="mt-2 text-2xl font-black text-primary">{clients.items.length}</p>
          <p className="mt-1 text-xs text-muted">ro‘yxatda</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="E’tibor kerak"
            subtitle="Zaxirasi tugab borayotgan mahsulotlar"
          />
          {lowStock.length === 0 ? (
            <EmptyState title="Zaxira yetarli" description="Hozircha kam qolgan mahsulotlar yo‘q." />
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.slice(0, 6).map((item) => (
                <li key={item.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-muted">Narxi: {formatMoney(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone="danger">{item.stock} dona</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="So‘nggi qarzlar"
          />
          {debts.items.length === 0 ? (
            <EmptyState title="Qarzlar hali yo‘q" description="Yangi qarzlar shu yerda ko‘rinadi." />
          ) : (
            <ul className="divide-y divide-border">
              {debts.items.slice(0, 6).map((debt) => (
                <li key={debt.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{debt.client.name}</p>
                    <p className="text-xs text-muted">{new Date(debt.createdAt).toLocaleDateString("uz-UZ")}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatMoney(Number(debt.totalAmount) - Number(debt.paidAmount))}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
