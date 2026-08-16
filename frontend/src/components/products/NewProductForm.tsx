"use client";
import { useActionState } from "react";
import { createProductAction, type FormState } from "@/lib/actions/ledger";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { InlineFormMessage } from "@/components/ui/InlineFormMessage";
const initialState: FormState = {};
export function NewProductForm() {
  const [state, action, pending] = useActionState(createProductAction, initialState);
  return <form action={action} className="space-y-3"><div><Label htmlFor="name">Mahsulot nomi</Label><Input id="name" name="name" required placeholder="Masalan, Pepsi 1L" /></div><div className="grid grid-cols-2 gap-3"><div><Label htmlFor="price">Narxi (so‘m)</Label><Input id="price" name="price" type="number" min="0" required /></div><div><Label htmlFor="stock">Soni</Label><Input id="stock" name="stock" type="number" min="0" required /></div></div><InlineFormMessage {...state} /><Button className="w-full" disabled={pending}>{pending ? "Qo‘shilmoqda…" : "Mahsulot qo‘shish"}</Button></form>;
}
