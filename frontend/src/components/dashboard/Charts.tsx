"use client";

import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = { primary: "#2b5f8a", success: "#3e8558", danger: "#c1502e", muted: "#8b8378" };

function TooltipBox({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-0.5 font-bold text-ink">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function StatusDonut({ data }: { data: Array<{ key: string; label: string; value: number; tone: "primary" | "success" | "danger" }> }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={40} outerRadius={62} paddingAngle={3} strokeWidth={0}>
            {data.map((d) => (
              <Cell key={d.key} fill={COLORS[d.tone]} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.key} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[d.tone] }} />
            <span className="font-medium text-ink">{d.label}</span>
            <span className="text-muted">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopDebtorsBar({ data }: { data: Array<{ name: string; amount: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 12, fill: COLORS.muted }} axisLine={false} tickLine={false} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(43,95,138,0.06)" }} />
        <Bar dataKey="amount" fill={COLORS.danger} radius={[0, 8, 8, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendArea({ data }: { data: Array<{ date: string; count: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
        <YAxis hide allowDecimals={false} />
        <Tooltip content={<TooltipBox />} />
        <Area type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#trendFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
