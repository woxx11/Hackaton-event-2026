"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCustomerAction, type ActionState } from "@/lib/actions/customers";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FormError } from "@/components/ui/EmptyState";

const initialState: ActionState = {};

export function NewCustomerForm() {
  const [state, formAction, isPending] = useActionState(createCustomerAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) formRef.current?.reset();
    wasPending.current = isPending;
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormError message={state.error} />
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required placeholder="Jane Smith" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="jane@example.com" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="+1 555 000 0000" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Adding…" : "Add customer"}
      </Button>
    </form>
  );
}
