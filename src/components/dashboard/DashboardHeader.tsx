"use client";

import { useRouter } from "next/navigation";
import { Calendar, Users, Box, Plus } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import ThemeToggle from "./ThemeToggle";
import type { GlobalFilters, TabKey } from "./types";
import { DATE_RANGE_OPTIONS, FORMAT_OPTIONS, SHIFT_OPTIONS } from "./types";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "shift", label: "Shift" },
  { key: "format", label: "Format" },
  { key: "aiPerformance", label: "AI Performance" },
];

export default function DashboardHeader({
  activeTab,
  onTabChange,
  filters,
  onFiltersChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  filters: GlobalFilters;
  onFiltersChange: (filters: GlobalFilters) => void;
}) {
  const router = useRouter();

  return (
    <div className="px-8 pt-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Hi, Rohit Kumar
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Track, manage and forecast your quality sessions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <FilterDropdown
            icon={Calendar}
            options={DATE_RANGE_OPTIONS}
            value={filters.dateRange}
            onChange={(dateRange) => onFiltersChange({ ...filters, dateRange })}
          />
          <FilterDropdown
            icon={Users}
            options={SHIFT_OPTIONS}
            value={filters.shift}
            onChange={(shift) => onFiltersChange({ ...filters, shift })}
          />
          <FilterDropdown
            icon={Box}
            options={FORMAT_OPTIONS}
            value={filters.format}
            onChange={(format) => onFiltersChange({ ...filters, format })}
          />
          <button
            type="button"
            onClick={() => router.push("/new-session")}
            className="flex items-center gap-2 rounded-lg bg-[#0155fb] px-4 py-2 text-sm font-medium text-white hover:bg-[#0146d1]"
          >
            <Plus className="h-4 w-4" />
            New session
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-[var(--info-bg)] font-medium text-[var(--accent-blue)]"
                : "text-[var(--text-faint)] hover:text-[var(--text-muted)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
