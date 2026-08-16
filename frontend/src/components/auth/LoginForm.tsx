"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";
import type { AuthFormState } from "@/lib/actions/auth";
import type { Dictionary } from "@/lib/i18n/config";

const initialState: AuthFormState = {};

export function LoginForm({
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
        <Label htmlFor="phone">{t.auth.login.phone}</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" required />
      </div>
      <div>
        <Label htmlFor="password">{t.auth.login.password}</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t.auth.login.submitting : t.auth.login.submit}
      </Button>
    </form>
  );
}
