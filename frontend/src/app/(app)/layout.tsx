import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { MobileNav } from "@/components/shell/MobileNav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { locale, t } = await getDictionary();

  return (
    <div className="flex min-h-screen">
      <Sidebar shopName={user.shopName ?? user.name} t={t} />
      <div className="flex flex-1 flex-col">
        <Topbar user={user} t={t} locale={locale} />
        <main className="flex-1 bg-bg px-5 py-8 pb-20 sm:px-8 md:pb-8">{children}</main>
      </div>
      <MobileNav t={t} />
    </div>
  );
}
