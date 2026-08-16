import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Sale } from "@/lib/types";

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
}

const STATUS_TONE = {
  COMPLETED: "success",
  VOID: "neutral",
  REFUNDED: "danger",
  PARTIALLY_REFUNDED: "danger",
} as const;

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sale = await apiFetch<Sale>(`/sales/${id}`);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Receipt"
        subtitle={new Date(sale.createdAt).toLocaleString()}
        action={
          <Link href="/sales" className="text-sm font-medium text-primary hover:text-primary-hover">
            Back to sales
          </Link>
        }
      />

      <Card className="p-6">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-medium text-ink">{sale.customer?.name ?? "Walk-in customer"}</p>
            <p className="text-xs text-muted">{sale.store.name} · Served by {sale.employee.user.name}</p>
          </div>
          <Badge tone={STATUS_TONE[sale.status]}>{sale.status}</Badge>
        </div>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="py-2 font-medium">Item</th>
              <th className="py-2 font-medium text-right">Qty</th>
              <th className="py-2 font-medium text-right">Price</th>
              <th className="py-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sale.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5">
                  <p className="font-medium text-ink">{item.productVariant.product.name}</p>
                  <p className="text-xs text-muted">{item.productVariant.sku}</p>
                </td>
                <td className="py-2.5 text-right">{item.quantity}</td>
                <td className="py-2.5 text-right text-muted">{formatMoney(item.unitPrice)}</td>
                <td className="py-2.5 text-right font-medium text-ink">{formatMoney(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{formatMoney(sale.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Tax</span>
            <span>{formatMoney(sale.taxTotal)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatMoney(sale.total)}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">Payments</p>
          {sale.payments.map((p) => (
            <div key={p.id} className="flex justify-between text-sm text-ink">
              <span>{p.method}</span>
              <span>{formatMoney(p.amount)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
