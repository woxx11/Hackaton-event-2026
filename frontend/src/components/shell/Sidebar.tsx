"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Wallet, Package, Users, History } from "lucide-react";
import { clsx } from "@/lib/clsx";
import type { Dictionary } from "@/lib/i18n/config";

export function Sidebar({ shopName, t }: { shopName: string; t: Dictionary }) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/sales", label: t.nav.sales, icon: Wallet },
    { href: "/products", label: t.nav.products, icon: Package },
    { href: "/customers", label: t.nav.customers, icon: Users },
    { href: "/history", label: t.nav.history, icon: History },
  ];

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface md:sticky md:top-0 md:flex">
      <div className="flex h-20 items-center border-b border-border px-5">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt={t.common.appName} width={40} height={40} className="h-10 w-10 rounded-xl object-cover shadow-sm" />
          <span className="text-lg font-black tracking-tight text-primary">{t.common.appName}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active ? "text-white" : "text-ink hover:bg-primary-tint hover:text-primary",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-primary shadow-sm shadow-primary/30"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative h-5 w-5 shrink-0" strokeWidth={2.25} />
              <span className="relative">{item.label}</span>
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
