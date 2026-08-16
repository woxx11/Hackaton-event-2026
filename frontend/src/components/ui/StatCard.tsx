import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/Motion";

type Tone = "primary" | "success" | "danger" | "ink";

const iconWrap: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  ink: "bg-ink/5 text-ink",
};

const valueColor: Record<Tone, string> = {
  primary: "text-primary",
  success: "text-success",
  danger: "text-danger",
  ink: "text-ink",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "ink",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <Card hover className="p-5">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconWrap[tone]}`}>
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
        </div>
        <p className={`mt-3 text-2xl font-black tracking-tight ${valueColor[tone]}`}>{value}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </Card>
    </FadeIn>
  );
}
