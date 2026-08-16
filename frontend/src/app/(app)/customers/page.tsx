import { apiFetch } from "@/lib/api";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewCustomerForm } from "@/components/customers/NewCustomerForm";
import type { Client } from "@/lib/types";

export default async function CustomersPage() {
  const { items } = await apiFetch<{ items: Client[] }>("/seller/clients");
  return <div className="mx-auto max-w-6xl"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-success">CRM</p><h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Mijozlar</h1><p className="mt-1 text-sm text-muted">Har bir mijozning qarzini aniq va shaffof yuriting.</p></div><div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader title={`${items.length} mijoz`} subtitle="Telefon raqami orqali tez toping" />{items.length ? <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-xs font-bold uppercase tracking-wide text-muted"><th className="px-6 py-3">Mijoz</th><th className="px-6 py-3">Telefon</th><th className="px-6 py-3">Qo‘shilgan sana</th></tr></thead><tbody className="divide-y">{items.map((client) => <tr key={client.id} className="hover:bg-primary-tint/35"><td className="px-6 py-4 font-semibold text-ink">{client.name}</td><td className="px-6 py-4 text-muted">{client.phone}</td><td className="px-6 py-4 text-muted">{new Date(client.createdAt).toLocaleDateString("uz-UZ")}</td></tr>)}</tbody></table></div> : <EmptyState title="Mijozlar yo‘q" description="Birinchi mijozingizni qo‘shing." />}</Card><Card className="h-fit p-6"><h2 className="mb-1 text-lg font-black text-ink">Yangi mijoz</h2><p className="mb-5 text-sm text-muted">Qarz yozish uchun mijozni oldin qo‘shing.</p><NewCustomerForm /></Card></div></div>;
}
