"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerCompanyAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerCompanyAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">HISOBIM</h1>
          <p className="mt-1 text-sm text-muted">Set up your company in a minute</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-lg border border-border bg-surface p-6 shadow-sm">
          <FormError message={state.error} />

          <div>
            <Label htmlFor="companyName">Company name</Label>
            <Input id="companyName" name="companyName" required placeholder="Acme Retail" />
          </div>

          <div>
            <Label htmlFor="storeName">First store name</Label>
            <Input id="storeName" name="storeName" defaultValue="Main Store" required />
          </div>

          <div className="border-t border-border pt-4">
            <Label htmlFor="ownerName">Your name</Label>
            <Input id="ownerName" name="ownerName" required placeholder="Jane Doe" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
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
            {isPending ? "Creating your company…" : "Create company"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
