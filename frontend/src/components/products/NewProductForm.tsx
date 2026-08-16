"use client";

import { useActionState, useRef, useEffect } from "react";
import { createProductAction, type ActionState } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";
import type { Brand, Category } from "@/lib/types";

const initialState: ActionState = {};

export function NewProductForm({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const [state, formAction, isPending] = useActionState(createProductAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      formRef.current?.reset();
    }
    wasPending.current = isPending;
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormError message={state.error} />

      <div>
        <Label htmlFor="name">Product name</Label>
        <Input id="name" name="name" required placeholder="Espresso Beans 1kg" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" required placeholder="ESP-1KG" />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" min="0" step="0.01" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="cost">Cost</Label>
          <Input id="cost" name="cost" type="number" min="0" step="0.01" required />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" name="categoryId" defaultValue="">
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="brandId">Brand</Label>
        <Select id="brandId" name="brandId" defaultValue="">
          <option value="">None</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Adding…" : "Add product"}
      </Button>
    </form>
  );
}
