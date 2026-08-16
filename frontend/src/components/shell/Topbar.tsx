import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import type { CurrentUser } from "@/lib/types";

export function Topbar({ user }: { user: CurrentUser }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-8">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-ink">{user.name}</p>
          <p className="text-xs text-muted">{user.role}</p>
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
