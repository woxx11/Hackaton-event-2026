"use client";
import { useActionState } from "react";
import { createClientAction, type FormState } from "@/lib/actions/ledger";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { InlineFormMessage } from "@/components/ui/InlineFormMessage";
const initialState: FormState = {};
export function NewCustomerForm() { const [state, action, pending] = useActionState(createClientAction, initialState); return <form action={action} className="space-y-3"><div><Label htmlFor="name">Ism-familiya</Label><Input id="name" name="name" required placeholder="Ali Valiyev" /></div><div><Label htmlFor="phone">Telefon raqam</Label><Input id="phone" name="phone" type="tel" required placeholder="+998 90 123 45 67" /></div><InlineFormMessage {...state} /><Button className="w-full" disabled={pending}>{pending ? "Qo‘shilmoqda…" : "Mijoz qo‘shish"}</Button></form>; }
