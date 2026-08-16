import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewCustomerForm } from "@/components/customers/NewCustomerForm";
import type { Customer, Paginated } from "@/lib/types";

export default async function CustomersPage() {
  const customers = await apiFetch<Paginated<Customer>>("/customers", { query: { pageSize: 50 } });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Customers" subtitle="Everyone who has shopped with you" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title={`${customers.pagination.total} customers`} />
            {customers.items.length === 0 ? (
              <EmptyState
                title="No customers yet"
                description="Add a customer to start tracking their purchases and loyalty."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Contact</th>
                      <th className="px-6 py-3 font-medium text-right">Loyalty points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customers.items.map((customer) => (
                      <tr key={customer.id} className="hover:bg-bg">
                        <td className="px-6 py-3 font-medium text-ink">{customer.name}</td>
                        <td className="px-6 py-3 text-muted">
                          {customer.email ?? customer.phone ?? "—"}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Badge tone="primary">{customer.loyaltyAccount?.points ?? 0} pts</Badge>
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
          <h2 className="mb-4 text-base font-semibold text-ink">Add customer</h2>
          <NewCustomerForm />
        </Card>
      </div>
    </div>
  );
}
