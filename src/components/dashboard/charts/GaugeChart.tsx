"use client";

import { useTheme } from "next-themes";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

export default function GaugeChart({
  title,
  value,
  color,
  subtitle,
  badge,
}: {
  title: string;
  value: number;
  color: string;
  subtitle: string;
  badge: string;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const trackColor = isDark ? "#1e2334" : "#e2e5ec";

  const data = [{ name: title, value, fill: color }];
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
        {title}
        <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-[var(--text-faint)] shadow-[var(--shadow-card)]">
          i
        </span>
      </div>
      <div className="relative mx-auto mt-2 h-[130px] w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            width={220}
            height={130}
            cx="50%"
            cy="100%"
            innerRadius={80}
            outerRadius={110}
            barSize={14}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={7}
              background={{ fill: trackColor }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{value}%</div>
          <div className="text-xs text-[var(--text-muted)]">{subtitle}</div>
        </div>
      </div>
      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#1c402b] px-2.5 py-0.5 text-xs font-medium text-[#c9f9e5]">
        {badge}
      </span>
    </div>
  );
}
