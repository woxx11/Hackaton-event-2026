import { apiFetch } from "@/lib/api";
import { createCategoryAction, createBrandAction } from "@/lib/actions/products";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewProductForm } from "@/components/products/NewProductForm";
import { QuickAddList } from "@/components/products/QuickAddList";
import type { Brand, Category, Paginated, Product } from "@/lib/types";

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
}

export default async function ProductsPage() {
  const [products, categories, brands] = await Promise.all([
    apiFetch<Paginated<Product>>("/products", { query: { pageSize: 50 } }),
    apiFetch<{ items: Category[] }>("/categories"),
    apiFetch<{ items: Brand[] }>("/brands"),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Products" subtitle="Your catalog of products and variants" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title={`${products.pagination.total} products`} />
            {products.items.length === 0 ? (
              <EmptyState
                title="No products yet"
                description="Add your first product using the form to get started."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                      <th className="px-6 py-3 font-medium">Product</th>
                      <th className="px-6 py-3 font-medium">SKU</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium text-right">Price</th>
                      <th className="px-6 py-3 font-medium text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.items.map((product) =>
                      product.variants.map((variant) => (
                        <tr key={variant.id} className="hover:bg-bg">
                          <td className="px-6 py-3">
                            <p className="font-medium text-ink">{product.name}</p>
                            {variant.name && <p className="text-xs text-muted">{variant.name}</p>}
                          </td>
                          <td className="px-6 py-3 text-muted">{variant.sku}</td>
                          <td className="px-6 py-3">
                            {product.category ? (
                              <Badge>{product.category.name}</Badge>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-right font-medium text-ink">
                            {formatMoney(variant.price)}
                          </td>
                          <td className="px-6 py-3 text-right text-muted">{formatMoney(variant.cost)}</td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <QuickAddList
                label="Categories"
                items={categories.items}
                onAdd={async (name) => {
                  "use server";
                  await createCategoryAction(name);
                }}
              />
              <QuickAddList
                label="Brands"
                items={brands.items}
                onAdd={async (name) => {
                  "use server";
                  await createBrandAction(name);
                }}
              />
            </div>
          </Card>
        </div>

        <Card className="h-fit p-6">
          <h2 className="mb-4 text-base font-semibold text-ink">Add product</h2>
          <NewProductForm categories={categories.items} brands={brands.items} />
        </Card>
      </div>
    </div>
  );
}
