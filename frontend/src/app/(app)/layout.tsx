import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar companyName={user.company.name} />
      <div className="flex flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 bg-bg px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
