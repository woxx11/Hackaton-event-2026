import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import type { Seller } from "@/lib/types";

export function Topbar({ user }: { user: Seller }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-surface px-5 sm:px-8">
      <p className="hidden text-sm font-medium text-muted sm:block">Do‘koningiz hisobi — bir joyda.</p>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-ink">{user.name}</p>
          <p className="text-xs text-muted">Do‘kon egasi</p>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="secondary" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
