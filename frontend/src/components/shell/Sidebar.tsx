"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Boshqaruv" },
  { href: "/sales", label: "Qarzlar" },
  { href: "/products", label: "Mahsulotlar" },
  { href: "/customers", label: "Mijozlar" },
];

export function Sidebar({ shopName }: { shopName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-primary/10 bg-surface">
      <div className="flex h-20 items-center border-b border-border px-5">
        <div className="flex items-center gap-3">
          <Image src="/hisobim-logo.png" alt="Hisobim" width={40} height={40} className="h-10 w-10 rounded-xl object-cover" />
          <span className="text-lg font-black tracking-tight text-primary">Hisobim</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-primary text-white shadow-sm" : "text-ink hover:bg-primary-tint hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-6 py-4">
        <p className="truncate text-xs font-bold uppercase tracking-wide text-muted">{shopName}</p>
      </div>
    </aside>
  );
}
