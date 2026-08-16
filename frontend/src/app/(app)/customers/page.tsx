import { apiFetch } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/shell/PageHeader";
import { NewCustomerForm } from "@/components/customers/NewCustomerForm";
import { CustomersTable } from "@/components/customers/CustomersTable";
import type { Client } from "@/lib/types";

export default async function CustomersPage() {
  const { locale, t } = await getDictionary();
  const { items } = await apiFetch<{ items: Client[] }>("/seller/clients");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow={t.customers.eyebrow} tone="success" title={t.customers.title} subtitle={t.customers.subtitle} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={`${items.length} ${t.customers.count}`} subtitle={t.customers.listSubtitle} />
          <CustomersTable items={items} t={t} locale={locale} />
        </Card>
        <Card className="h-fit p-6">
          <h2 className="mb-1 text-lg font-black text-ink">{t.customers.newTitle}</h2>
          <p className="mb-5 text-sm text-muted">{t.customers.newSubtitle}</p>
          <NewCustomerForm t={t} />
        </Card>
      </div>
    </div>
  );
}
