"use client";

import {
  LayoutGrid,
  Package,
  ShieldAlert,
  Users,
  Clock,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Products", icon: Package, active: false },
  { label: "Defects", icon: ShieldAlert, active: false },
  { label: "User Management", icon: Users, active: false },
  { label: "Activity Log", icon: Clock, active: false },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col bg-[var(--bg-page)] px-3.5 py-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0155fb]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-[15px] font-semibold leading-tight text-[var(--text-primary)]">
            Sigma
          </div>
          <div className="text-xs leading-tight text-[var(--text-muted)]">
            Quality Station
          </div>
        </div>
      </div>

      <div className="mt-8 px-2 text-xs font-medium tracking-wide text-[var(--text-faint)]">
        MENU
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-[var(--bg-card)] font-medium text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 px-2 pt-4 shadow-[0_-1px_0_0_var(--border-subtle)]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-inset)] text-xs font-semibold text-[var(--text-primary)]">
          RK
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium leading-tight text-[var(--text-primary)]">
            Rohit Kumar
          </div>
          <div className="text-xs leading-tight text-[var(--text-muted)]">Operator</div>
        </div>
        <LogOut className="h-4 w-4 text-[var(--text-muted)]" />
      </div>
    </aside>
  );
}
