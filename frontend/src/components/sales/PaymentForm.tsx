"use client";
import { useActionState } from "react";
import { addPaymentAction, type FormState } from "@/lib/actions/ledger";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useActionToast } from "@/lib/useActionToast";
import type { Dictionary } from "@/lib/i18n/config";

const initialState: FormState = {};

export function PaymentForm({ debtId, max, t }: { debtId: string; max: number; t: Dictionary }) {
  const [state, action, pending] = useActionState(addPaymentAction, initialState);
  useActionToast(state);
  return (
    <form action={action} className="min-w-36">
      <input type="hidden" name="debtId" value={debtId} />
      <Input name="amount" type="number" min="1" max={max} placeholder={t.sales.payment} required />
      <Button size="sm" className="mt-2 w-full" disabled={pending}>
        {pending ? "…" : t.sales.paymentSubmit}
      </Button>
    </form>
  );
}
