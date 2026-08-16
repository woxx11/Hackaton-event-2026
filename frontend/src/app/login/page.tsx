"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="auth-backdrop flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src="/hisobim-logo.png" alt="Hisobim" width={112} height={112} priority className="mx-auto h-28 w-28 object-contain" />
          <h1 className="mt-3 text-3xl font-black tracking-tight text-primary">Hisobim</h1>
          <p className="mt-1 text-sm text-muted">Do‘koningiz nazorati — bir joyda</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-3xl border border-white/70 bg-surface p-7 shadow-xl shadow-primary/10">
          <FormError message={state.error} />

          <div>
            <Label htmlFor="phone">Telefon raqam</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" required />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Kirilmoqda…" : "Kirish"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Hisobim’da yangimisiz?{" "}
          <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
            Ro‘yxatdan o‘tish
          </Link>
        </p>
      </div>
    </div>
  );
}
