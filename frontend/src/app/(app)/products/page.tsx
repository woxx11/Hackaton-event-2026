import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewProductForm } from "@/components/products/NewProductForm";
import type { LedgerProduct } from "@/lib/types";

const money = (value: string) => new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(Number(value)) + " so‘m";

export default async function ProductsPage() {
  const { items } = await apiFetch<{ items: LedgerProduct[] }>("/seller/products");
  return <div className="mx-auto max-w-6xl"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-success">Katalog</p><h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Mahsulotlar</h1><p className="mt-1 text-sm text-muted">Narx va zaxirangizni bir qarashda boshqaring.</p></div><div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader title={`${items.length} mahsulot`} subtitle="Do‘koningizdagi faol katalog" />{items.length ? <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-xs font-bold uppercase tracking-wide text-muted"><th className="px-6 py-3">Mahsulot</th><th className="px-6 py-3 text-right">Narx</th><th className="px-6 py-3 text-right">Zaxira</th><th className="px-6 py-3">Holat</th></tr></thead><tbody className="divide-y">{items.map((p) => <tr key={p.id} className="hover:bg-primary-tint/35"><td className="px-6 py-4 font-semibold text-ink">{p.name}</td><td className="px-6 py-4 text-right text-muted">{money(p.price)}</td><td className="px-6 py-4 text-right font-bold text-ink">{p.stock}</td><td className="px-6 py-4"><Badge tone={p.stock <= 5 ? "danger" : "success"}>{p.stock <= 5 ? "Kam qoldi" : "Yetarli"}</Badge></td></tr>)}</tbody></table></div> : <EmptyState title="Katalog bo‘sh" description="Birinchi mahsulotingizni qo‘shing." />}</Card><Card className="h-fit p-6"><h2 className="mb-1 text-lg font-black text-ink">Yangi mahsulot</h2><p className="mb-5 text-sm text-muted">Qarz yozishda darhol tanlash mumkin bo‘ladi.</p><NewProductForm /></Card></div></div>;
}
