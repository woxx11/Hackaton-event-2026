import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdjustInventoryForm } from "@/components/inventory/AdjustInventoryForm";
import type { InventoryRow, Store } from "@/lib/types";

export default async function InventoryPage() {
  const [inventory, stores] = await Promise.all([
    apiFetch<{ items: InventoryRow[] }>("/inventory"),
    apiFetch<{ items: Store[] }>("/stores"),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Inventory" subtitle="Stock levels across your stores" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title={`${inventory.items.length} stock records`} />
            {inventory.items.length === 0 ? (
              <EmptyState
                title="No inventory yet"
                description="Stock levels appear here once you add products."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                      <th className="px-6 py-3 font-medium">Product</th>
                      <th className="px-6 py-3 font-medium">Store</th>
                      <th className="px-6 py-3 font-medium text-right">On hand</th>
                      <th className="px-6 py-3 font-medium text-right">Reorder point</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {inventory.items.map((row) => (
                      <tr key={row.id} className="hover:bg-bg">
                        <td className="px-6 py-3">
                          <p className="font-medium text-ink">{row.productVariant.product.name}</p>
                          <p className="text-xs text-muted">{row.productVariant.sku}</p>
                        </td>
                        <td className="px-6 py-3 text-muted">{row.store?.name ?? "—"}</td>
                        <td className="px-6 py-3 text-right font-medium text-ink">{row.quantityOnHand}</td>
                        <td className="px-6 py-3 text-right text-muted">{row.reorderPoint}</td>
                        <td className="px-6 py-3">
                          {row.isLowStock ? (
                            <Badge tone="danger">Low stock</Badge>
                          ) : (
                            <Badge tone="success">Healthy</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <Card className="h-fit p-6">
          <h2 className="mb-4 text-base font-semibold text-ink">Adjust stock</h2>
          <AdjustInventoryForm rows={inventory.items} stores={stores.items} />
        </Card>
      </div>
    </div>
  );
}
