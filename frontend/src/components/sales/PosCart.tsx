"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { createDebtAction, type FormState } from "@/lib/actions/ledger";
import { Button } from "@/components/ui/Button";
import { Label, Select, Textarea } from "@/components/ui/Input";
import { useActionToast } from "@/lib/useActionToast";
import { formatMoney } from "@/lib/money";
import type { Client, LedgerProduct } from "@/lib/types";
import type { Dictionary, Locale } from "@/lib/i18n/config";

const initialState: FormState = {};

interface CartLine {
  productId: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

export function PosCart({ clients, products, t, locale }: { clients: Client[]; products: LedgerProduct[]; t: Dictionary; locale: Locale }) {
  const [state, action, pending] = useActionState(createDebtAction, initialState);
  useActionToast(state);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [productId, setProductId] = useState("");
  const money = (v: number) => formatMoney(v, locale, t.common.currency);
  const total = useMemo(() => cart.reduce((sum, line) => sum + line.price * line.quantity, 0), [cart]);

  if (!clients.length || !products.length) {
    return <p className="rounded-xl bg-primary-tint p-3 text-sm text-primary">{t.sales.noData}</p>;
  }

  function addToCart() {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((line) => (line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line));
      }
      return [...prev, { productId: product.id, name: product.name, price: Number(product.price), stock: product.stock, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((line) => (line.productId === id ? { ...line, quantity: Math.min(line.stock, Math.max(1, line.quantity + delta)) } : line))
        .filter(Boolean),
    );
  }

  function removeLine(id: string) {
    setCart((prev) => prev.filter((line) => line.productId !== id));
  }

  return (
    <form
      action={(formData) => {
        formData.set("items", JSON.stringify(cart.map(({ productId, quantity }) => ({ productId, quantity }))));
        action(formData);
        setCart([]);
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="clientId">{t.sales.client}</Label>
        <Select id="clientId" name="clientId" required defaultValue="">
          <option value="" disabled>{t.sales.clientPlaceholder}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="productId">{t.sales.product}</Label>
        <div className="flex gap-2">
          <Select id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} className="flex-1">
            <option value="">{t.sales.productPlaceholder}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} · {money(Number(p.price))} ({p.stock})</option>
            ))}
          </Select>
          <Button type="button" variant="secondary" size="md" onClick={addToCart} disabled={!productId}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-8 text-center">
            <ShoppingCart className="h-5 w-5 text-muted" />
            <p className="text-sm text-muted">{t.sales.cartEmpty}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {cart.map((line) => (
              <li key={line.productId} className="flex items-center gap-2 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{line.name}</p>
                  <p className="text-xs text-muted">{money(line.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => updateQuantity(line.productId, -1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted hover:text-ink">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-ink">{line.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(line.productId, 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted hover:text-ink">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button type="button" onClick={() => removeLine(line.productId)} className="text-muted hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">{t.sales.total}</span>
            <span className="text-sm font-black text-ink">{money(total)}</span>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="notes">
          {t.sales.notes} <span className="normal-case text-muted/70">({t.common.optional})</span>
        </Label>
        <Textarea id="notes" name="notes" rows={2} placeholder={t.sales.notesPlaceholder} />
      </div>

      <Button className="w-full" disabled={pending || cart.length === 0}>
        {pending ? t.sales.submitting : t.sales.submit}
      </Button>
    </form>
  );
}
