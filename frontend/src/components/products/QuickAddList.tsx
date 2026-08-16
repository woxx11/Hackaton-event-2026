"use client";

import { useRef, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function QuickAddList({
  label,
  items,
  onAdd,
}: {
  label: string;
  items: Array<{ id: string; name: string }>;
  onAdd: (name: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {items.length === 0 && <span className="text-sm text-muted">None yet</span>}
        {items.map((item) => (
          <Badge key={item.id}>{item.name}</Badge>
        ))}
      </div>
      <form
        className="flex gap-2"
        action={() => {
          const value = inputRef.current?.value.trim();
          if (!value) return;
          startTransition(async () => {
            await onAdd(value);
            if (inputRef.current) inputRef.current.value = "";
          });
        }}
      >
        <Input ref={inputRef} placeholder={`New ${label.toLowerCase()}…`} className="h-9" />
        <Button type="submit" variant="secondary" size="sm" disabled={isPending}>
          Add
        </Button>
      </form>
    </div>
  );
}
