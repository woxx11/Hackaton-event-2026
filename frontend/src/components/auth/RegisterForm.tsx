"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";
import type { AuthFormState } from "@/lib/actions/auth";
import type { Dictionary } from "@/lib/i18n/config";

const initialState: AuthFormState = {};

export function RegisterForm({
  action,
  t,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  t: Dictionary;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />
      <div>
        <Label htmlFor="name">{t.auth.register.name}</Label>
        <Input id="name" name="name" required placeholder="Azizbek Karimov" />
      </div>
      <div>
        <Label htmlFor="shopName">{t.auth.register.shopName}</Label>
        <Input id="shopName" name="shopName" required placeholder="Baraka market" />
      </div>
      <div>
        <Label htmlFor="phone">{t.auth.register.phone}</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" required />
      </div>
      <div>
        <Label htmlFor="password">{t.auth.register.password}</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t.auth.register.submitting : t.auth.register.submit}
      </Button>
    </form>
  );
}
