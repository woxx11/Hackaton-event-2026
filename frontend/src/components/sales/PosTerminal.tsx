"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchProductsAction, createSaleAction } from "@/lib/actions/sales";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";
import type { Customer, Product, Store } from "@/lib/types";

interface CartLine {
  variantId: string;
  productName: string;
  variantLabel: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
}

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "MOBILE", label: "Mobile" },
  { value: "STORE_CREDIT", label: "Store credit" },
] as const;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function PosTerminal({ stores, customers }: { stores: Store[]; customers: Customer[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, startSearch] = useTransition();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]["value"]>("CASH");
  const [tenderedInput, setTenderedInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, startSubmit] = useTransition();
  const [completedSaleId, setCompletedSaleId] = useState<string | null>(null);

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [cart],
  );
  const tendered = tenderedInput === "" ? total : Number(tenderedInput);
  const change = paymentMethod === "CASH" ? Math.max(tendered - total, 0) : 0;

  function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    startSearch(async () => {
      setResults(await searchProductsAction(value));
    });
  }

  function addToCart(product: Product, variant: Product["variants"][number]) {
    setCart((prev) => {
      const existing = prev.find((l) => l.variantId === variant.id);
      if (existing) {
        return prev.map((l) => (l.variantId === variant.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [
        ...prev,
        {
          variantId: variant.id,
          productName: product.name,
          variantLabel: variant.name,
          sku: variant.sku,
          unitPrice: Number(variant.price),
          quantity: 1,
        },
      ];
    });
    setQuery("");
    setResults([]);
  }

  function updateQuantity(variantId: string, quantity: number) {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }

  function completeSale() {
    setError(undefined);
    if (cart.length === 0) {
      setError("Add at least one item to the cart.");
      return;
    }
    if (!storeId) {
      setError("Select a store.");
      return;
    }
    if (tendered < total) {
      setError("The amount tendered is less than the sale total.");
      return;
    }

    startSubmit(async () => {
      const result = await createSaleAction({
        storeId,
        customerId: customerId || undefined,
        items: cart.map((l) => ({ productVariantId: l.variantId, quantity: l.quantity })),
        payments: [{ method: paymentMethod, amount: Math.min(tendered, total) || total }],
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setCompletedSaleId(result.sale?.id ?? null);
      setCart([]);
      setTenderedInput("");
      setCustomerId("");
      router.refresh();
    });
  }

  if (completedSaleId) {
    return (
      <div className="rounded-lg border border-success/20 bg-success-tint p-8 text-center">
        <p className="text-lg font-semibold text-success">Sale completed</p>
        <p className="mt-1 text-sm text-ink/70">The sale has been recorded and inventory updated.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => setCompletedSaleId(null)}>
            New sale
          </Button>
          <Button onClick={() => router.push(`/sales/${completedSaleId}`)}>View receipt</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <Label htmlFor="search">Search products</Label>
          <Input
            id="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            autoComplete="off"
          />
          {isSearching && <p className="mt-1 text-xs text-muted">Searching…</p>}
          {results.length > 0 && (
            <div className="mt-2 divide-y divide-border rounded-md border border-border bg-surface">
              {results.map((product) =>
                product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => addToCart(product, variant)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-bg"
                  >
                    <span>
                      <span className="font-medium text-ink">{product.name}</span>
                      <span className="ml-2 text-xs text-muted">{variant.sku}</span>
                    </span>
                    <span className="font-medium text-ink">{formatMoney(Number(variant.price))}</span>
                  </button>
                )),
              )}
            </div>
          )}
        </div>

        <Card>
          {cart.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted">Cart is empty — search for a product above.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium text-right">Qty</th>
                  <th className="px-6 py-3 font-medium text-right">Price</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cart.map((line) => (
                  <tr key={line.variantId}>
                    <td className="px-6 py-3">
                      <p className="font-medium text-ink">{line.productName}</p>
                      <p className="text-xs text-muted">{line.sku}</p>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Input
                        type="number"
                        min={0}
                        value={line.quantity}
                        onChange={(e) => updateQuantity(line.variantId, Number(e.target.value))}
                        className="h-8 w-16 text-right"
                      />
                    </td>
                    <td className="px-6 py-3 text-right text-muted">{formatMoney(line.unitPrice)}</td>
                    <td className="px-6 py-3 text-right font-medium text-ink">
                      {formatMoney(line.unitPrice * line.quantity)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.variantId, 0)}
                        className="text-xs text-danger hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card className="space-y-4 p-6">
        <FormError message={error} />

        {stores.length > 1 && (
          <div>
            <Label htmlFor="store">Store</Label>
            <Select id="store" value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="customer">Customer (optional)</Label>
          <Select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Walk-in customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatMoney(total)}</span>
          </div>
          <div className="mt-1 flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>

        <div>
          <Label htmlFor="method">Payment method</Label>
          <Select
            id="method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>

        {paymentMethod === "CASH" && (
          <div>
            <Label htmlFor="tendered">Amount tendered</Label>
            <Input
              id="tendered"
              type="number"
              min={0}
              step="0.01"
              placeholder={total.toFixed(2)}
              value={tenderedInput}
              onChange={(e) => setTenderedInput(e.target.value)}
            />
            {change > 0 && <p className="mt-1 text-xs text-success">Change due: {formatMoney(change)}</p>}
          </div>
        )}

        <Button className="w-full" onClick={completeSale} disabled={isSubmitting || cart.length === 0}>
          {isSubmitting ? "Processing…" : `Complete sale · ${formatMoney(total)}`}
        </Button>
      </Card>
    </div>
  );
}
