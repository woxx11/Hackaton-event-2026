"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerCompanyAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerCompanyAction, initialState);

  return (
    <div className="auth-backdrop flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src="/hisobim-logo.png" alt="Hisobim" width={96} height={96} priority className="mx-auto h-24 w-24 object-contain" />
          <h1 className="mt-2 text-3xl font-black tracking-tight text-primary">Hisobim</h1>
          <p className="mt-1 text-sm text-muted">Do‘koningizni bir daqiqada oching</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-3xl border border-white/70 bg-surface p-7 shadow-xl shadow-primary/10">
          <FormError message={state.error} />

          <div>
            <Label htmlFor="name">Ismingiz</Label>
            <Input id="name" name="name" required placeholder="Azizbek Karimov" />
          </div>

          <div>
            <Label htmlFor="shopName">Do‘kon nomi</Label>
            <Input id="shopName" name="shopName" required placeholder="Baraka market" />
          </div>

          <div>
            <Label htmlFor="phone">Telefon raqam</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" required />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Hisob yaratilmoqda…" : "Hisob yaratish"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Akkauntingiz bormi?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
