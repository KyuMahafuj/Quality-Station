"use client";

import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export interface StackedBarDatum {
  name: string;
  accepted: number;
  rejected: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: StackedBarDatum }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0].payload;
  const total = datum.accepted + datum.rejected;
  const acceptedPct = total ? ((datum.accepted / total) * 100).toFixed(1) : "0";
  const rejectedPct = total ? ((datum.rejected / total) * 100).toFixed(1) : "0";
  return (
    <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card-hover)] px-4 py-3 text-xs shadow-xl">
      <div className="font-semibold text-[var(--text-primary)]">{label}</div>
      <div className="mt-2 flex items-center justify-between gap-6 text-[var(--text-muted)]">
        <span>Total</span>
        <span className="font-medium text-[var(--text-primary)]">{total.toLocaleString()}</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-6 text-[var(--text-muted)]">
        <span>Accepted</span>
        <span className="font-medium text-[var(--success)]">
          {datum.accepted.toLocaleString()} ({acceptedPct}%)
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-6 text-[var(--text-muted)]">
        <span>Rejected</span>
        <span className="font-medium text-[var(--danger)]">
          {datum.rejected.toLocaleString()} ({rejectedPct}%)
        </span>
      </div>
    </div>
  );
}

export default function StackedBarChart({ data }: { data: StackedBarDatum[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const tickColor = isDark ? "#667085" : "#8892a6";
  const labelColor = isDark ? "#f0f3f9" : "#0d1220";

  return (
    <div>
      <div className="mb-4 flex items-center gap-5 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#027a48]" />
          Accepted Products
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#eb6358]" />
          Rejected Products
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap={28}>
          <XAxis
            dataKey="name"
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="accepted" stackId="a" fill="#027a48" radius={[0, 0, 4, 4]} />
          <Bar dataKey="rejected" stackId="a" fill="#eb6358" radius={[4, 4, 0, 0]}>
            <LabelList
              position="top"
              content={(props) => {
                const { x, y, width, index } = props as {
                  x?: number;
                  y?: number;
                  width?: number;
                  index?: number;
                };
                if (index === undefined || x === undefined || width === undefined || y === undefined)
                  return null;
                const d = data[index];
                const total = d.accepted + d.rejected;
                return (
                  <text
                    x={x + width / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fill={labelColor}
                    fontSize={12}
                    fontWeight={600}
                  >
                    {total.toLocaleString()}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
