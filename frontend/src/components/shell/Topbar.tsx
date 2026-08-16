import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/shell/LanguageSwitcher";
import type { Seller } from "@/lib/types";
import type { Dictionary, Locale } from "@/lib/i18n/config";

export function Topbar({ user, t, locale }: { user: Seller; t: Dictionary; locale: Locale }) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-surface/90 px-5 backdrop-blur sm:px-8">
      <p className="hidden text-sm font-medium text-muted sm:block">{t.common.tagline}</p>
      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSwitcher locale={locale} />
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initials}
          </span>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-xs text-muted">{t.common.owner}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="secondary" size="sm">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t.common.signOut}</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
