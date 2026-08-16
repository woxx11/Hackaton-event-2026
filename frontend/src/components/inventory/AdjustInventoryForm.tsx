"use client";

import { useActionState, useState } from "react";
import { adjustInventoryAction, type ActionState } from "@/lib/actions/inventory";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";
import type { InventoryRow, Store } from "@/lib/types";

const initialState: ActionState = {};

export function AdjustInventoryForm({ rows, stores }: { rows: InventoryRow[]; stores: Store[] }) {
  const [state, formAction, isPending] = useActionState(adjustInventoryAction, initialState);
  const [rowKey, setRowKey] = useState("");

  const options = rows.map((r) => ({
    key: `${r.productVariantId}::${r.storeId}`,
    variantId: r.productVariantId,
    storeId: r.storeId ?? "",
    label: `${r.productVariant.product.name} (${r.productVariant.sku})`,
  }));
  const selected = options.find((o) => o.key === rowKey);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

      <div>
        <Label htmlFor="row">Product</Label>
        <Select id="row" value={rowKey} onChange={(e) => setRowKey(e.target.value)} required>
          <option value="" disabled>
            Select a product…
          </option>
          {options.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </Select>
        <input type="hidden" name="productVariantId" value={selected?.variantId ?? ""} />
        <input type="hidden" name="storeId" value={selected?.storeId ?? ""} />
      </div>

      {stores.length > 1 && (
        <p className="text-xs text-muted">Store is inferred from the selected product row.</p>
      )}

      <div>
        <Label htmlFor="quantityDelta">Adjustment</Label>
        <Input
          id="quantityDelta"
          name="quantityDelta"
          type="number"
          required
          placeholder="e.g. 10 or -3"
        />
      </div>

      <div>
        <Label htmlFor="reason">Reason</Label>
        <Input id="reason" name="reason" required placeholder="Received shipment, damaged goods, etc." />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !selected}>
        {isPending ? "Saving…" : "Apply adjustment"}
      </Button>
    </form>
  );
}
