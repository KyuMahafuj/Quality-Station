"use client";

import { useMemo, useState } from "react";
import { Calendar, Sparkles, Package, LayoutGrid, Users, type LucideIcon } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import FilterDropdown from "@/components/dashboard/FilterDropdown";
import { INITIAL_ACTIVITY, type ActivityEntry } from "@/components/activity-log/data";

const TODAY = "2026-07-23";
const DATE_RANGE_OPTIONS = ["Today", "Yesterday", "Last 7 days", "Last 30 days"];

const SEVERITY_STYLES: Record<ActivityEntry["severity"], { bg: string; text: string; label: string }> = {
  info: { bg: "bg-[var(--info-bg)]", text: "text-[var(--accent-blue)]", label: "Info" },
  warning: { bg: "bg-[var(--warning-bg)]", text: "text-[var(--warning)]", label: "Warning" },
  critical: { bg: "bg-[var(--danger-bg)]", text: "text-[var(--danger)]", label: "Critical" },
};

const MODULE_ICONS: Record<string, LucideIcon> = {
  "New Session": Sparkles,
  Products: Package,
  Dashboard: LayoutGrid,
  "User Management": Users,
};

function splitTimestamp(timestamp: string) {
  const [date, time] = timestamp.split(" ");
  return { date, time };
}

function daysAgo(n: number) {
  const d = new Date(`${TODAY}T00:00:00`);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function dateLabel(date: string) {
  if (date === TODAY) return "Today";
  if (date === daysAgo(1)) return "Yesterday";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function withinRange(date: string, range: string) {
  if (range === "Today") return date === TODAY;
  if (range === "Yesterday") return date === daysAgo(1);
  if (range === "Last 7 days") return date >= daysAgo(7);
  return date >= daysAgo(30);
}

export default function ActivityLogPage() {
  const [dateRange, setDateRange] = useState("Last 7 days");

  const filtered = INITIAL_ACTIVITY.filter((e) => withinRange(splitTimestamp(e.timestamp).date, dateRange));

  const groups = useMemo(() => {
    const byDate = new Map<string, ActivityEntry[]>();
    for (const entry of filtered) {
      const { date } = splitTimestamp(entry.timestamp);
      if (!byDate.has(date)) byDate.set(date, []);
      byDate.get(date)!.push(entry);
    }
    return Array.from(byDate.entries()).map(([date, entries]) => ({ date, label: dateLabel(date), entries }));
  }, [filtered]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-y-auto px-8 pb-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Activity Log</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              A record of session, product, and account activity across Sigma.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <FilterDropdown icon={Calendar} options={DATE_RANGE_OPTIONS} value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        <div className="mt-5">
          {groups.length === 0 && (
            <div className="rounded-xl bg-[var(--bg-card)] py-8 text-center text-sm text-[var(--text-faint)] shadow-[var(--shadow-card)]">
              No activity in this range.
            </div>
          )}

          {groups.map((group) => (
            <div key={group.date} className="mb-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                {group.label}
              </div>
              <div className="flex flex-col">
                {group.entries.map((entry, i) => {
                  const style = SEVERITY_STYLES[entry.severity];
                  const Icon = MODULE_ICONS[entry.module] ?? LayoutGrid;
                  const { time } = splitTimestamp(entry.timestamp);
                  const isLast = i === group.entries.length - 1;
                  return (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {!isLast && <span className="mt-1 w-px flex-1 bg-[var(--text-faint)]/15" />}
                      </div>
                      <div className={`flex-1 rounded-lg bg-[var(--bg-card)] px-4 py-2.5 shadow-[var(--shadow-card)] ${isLast ? "" : "mb-2"}`}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{entry.action}</span>
                          <span className="shrink-0 text-xs text-[var(--text-faint)]">{time}</span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">{entry.details}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <span className="font-medium text-[var(--text-muted)]">{entry.user}</span>
                          <span className="text-[var(--text-faint)]">&middot;</span>
                          <span className="text-[var(--text-faint)]">{entry.module}</span>
                          <span
                            className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.text}`}
                          >
                            {style.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
