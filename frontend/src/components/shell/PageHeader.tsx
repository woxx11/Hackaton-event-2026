import type { ReactNode } from "react";
import { FadeIn } from "@/components/ui/Motion";

type Tone = "primary" | "success" | "danger";

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  success: "text-success",
  danger: "text-danger",
};

export function PageHeader({
  eyebrow,
  tone = "success",
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  tone?: Tone;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <FadeIn className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className={`text-xs font-bold uppercase tracking-[.18em] ${toneClasses[tone]}`}>{eyebrow}</p>
        )}
        <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </FadeIn>
  );
}
