"use client";
import { useActionState } from "react";
import { createClientAction, type FormState } from "@/lib/actions/ledger";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useActionToast } from "@/lib/useActionToast";
import type { Dictionary } from "@/lib/i18n/config";

const initialState: FormState = {};

export function NewCustomerForm({ t }: { t: Dictionary }) {
  const [state, action, pending] = useActionState(createClientAction, initialState);
  useActionToast(state);
  return (
    <form action={action} className="space-y-3">
      <div>
        <Label htmlFor="name">{t.customers.form.name}</Label>
        <Input id="name" name="name" required placeholder={t.customers.form.namePlaceholder} />
      </div>
      <div>
        <Label htmlFor="phone">{t.customers.form.phone}</Label>
        <Input id="phone" name="phone" type="tel" required placeholder="+998 90 123 45 67" />
      </div>
      <Button className="w-full" disabled={pending}>
        {pending ? t.customers.form.submitting : t.customers.form.submit}
      </Button>
    </form>
  );
}
