"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Package, Users, History } from "lucide-react";
import { clsx } from "@/lib/clsx";
import type { Dictionary } from "@/lib/i18n/config";

export function MobileNav({ t }: { t: Dictionary }) {
  const pathname = usePathname();
  const NAV_ITEMS = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/sales", label: t.nav.sales, icon: Wallet },
    { href: "/products", label: t.nav.products, icon: Package },
    { href: "/customers", label: t.nav.customers, icon: Users },
    { href: "/history", label: t.nav.history, icon: History },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold",
              active ? "text-primary" : "text-muted",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.25} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
