import { apiFetch } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/shell/PageHeader";
import { NewProductForm } from "@/components/products/NewProductForm";
import { ProductsTable } from "@/components/products/ProductsTable";
import type { LedgerProduct } from "@/lib/types";

export default async function ProductsPage() {
  const { locale, t } = await getDictionary();
  const { items } = await apiFetch<{ items: LedgerProduct[] }>("/seller/products");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow={t.products.eyebrow} tone="success" title={t.products.title} subtitle={t.products.subtitle} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={`${items.length} ${t.products.count}`} subtitle={t.products.listSubtitle} />
          <ProductsTable items={items} t={t} locale={locale} />
        </Card>
        <Card className="h-fit p-6">
          <h2 className="mb-1 text-lg font-black text-ink">{t.products.newTitle}</h2>
          <p className="mb-5 text-sm text-muted">{t.products.newSubtitle}</p>
          <NewProductForm t={t} />
        </Card>
      </div>
    </div>
  );
}
