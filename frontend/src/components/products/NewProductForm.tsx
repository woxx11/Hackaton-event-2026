"use client";
import { useActionState } from "react";
import { createProductAction, type FormState } from "@/lib/actions/ledger";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useActionToast } from "@/lib/useActionToast";
import type { Dictionary } from "@/lib/i18n/config";

const initialState: FormState = {};

export function NewProductForm({ t }: { t: Dictionary }) {
  const [state, action, pending] = useActionState(createProductAction, initialState);
  useActionToast(state);
  return (
    <form action={action} className="space-y-3">
      <div>
        <Label htmlFor="name">{t.products.form.name}</Label>
        <Input id="name" name="name" required placeholder={t.products.form.namePlaceholder} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="price">{t.products.form.price}</Label>
          <Input id="price" name="price" type="number" min="0" required />
        </div>
        <div>
          <Label htmlFor="stock">{t.products.form.stock}</Label>
          <Input id="stock" name="stock" type="number" min="0" required />
        </div>
      </div>
      <Button className="w-full" disabled={pending}>
        {pending ? t.products.form.submitting : t.products.form.submit}
      </Button>
    </form>
  );
}
