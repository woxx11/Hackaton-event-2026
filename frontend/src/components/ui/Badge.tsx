import type { ReactNode } from "react";
import { clsx } from "@/lib/clsx";

type Tone = "neutral" | "success" | "danger" | "primary";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-bg text-muted border-border",
  success: "bg-success-tint text-success border-transparent",
  danger: "bg-danger-tint text-danger border-transparent",
  primary: "bg-primary-tint text-primary border-transparent",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
