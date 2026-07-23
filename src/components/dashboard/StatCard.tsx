import { ArrowUp, ArrowDown } from "lucide-react";
import type { StatCardData } from "./types";

export default function StatCard({ label, value, trend, subtitle }: StatCardData) {
  return (
    <div className="flex-1 rounded-xl bg-[var(--bg-card)] px-5 py-4 shadow-[var(--shadow-card)]">
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
      <div className="mt-2 text-[28px] font-bold leading-tight text-[var(--text-primary)]">
        {value}
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span
            className={`flex items-center gap-0.5 font-medium ${
              trend.direction === "up" ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {trend.direction === "up" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {trend.value}
          </span>
          <span className="text-[var(--text-faint)]">vs last month</span>
        </div>
      )}
      {subtitle && (
        <div className="mt-2 text-xs text-[var(--text-faint)]">{subtitle}</div>
      )}
    </div>
  );
}
