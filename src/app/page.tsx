"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import ShiftTab from "@/components/dashboard/tabs/ShiftTab";
import FormatTab from "@/components/dashboard/tabs/FormatTab";
import AiPerformanceTab from "@/components/dashboard/tabs/AiPerformanceTab";
import type { GlobalFilters, TabKey } from "@/components/dashboard/types";
import { ALL_FORMATS, ALL_SHIFTS } from "@/components/dashboard/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [filters, setFilters] = useState<GlobalFilters>({
    dateRange: "Today",
    shift: ALL_SHIFTS,
    format: ALL_FORMATS,
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="h-screen flex-1 overflow-y-auto pb-10">
        <DashboardHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <div className="px-8 pt-6">
          {activeTab === "overview" && <OverviewTab filters={filters} />}
          {activeTab === "shift" && <ShiftTab filters={filters} />}
          {activeTab === "format" && <FormatTab filters={filters} />}
          {activeTab === "aiPerformance" && <AiPerformanceTab />}
        </div>
      </div>
    </div>
  );
}
