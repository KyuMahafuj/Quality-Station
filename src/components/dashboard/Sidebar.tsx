"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Users,
  Clock,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, href: "/" },
  { label: "Products", icon: Package, href: "/products" },
  { label: "User Management", icon: Users, href: "#" },
  { label: "Activity Log", icon: Clock, href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[248px] shrink-0 flex-col gap-6 bg-[var(--bg-page)] px-4 py-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-blue)] shadow-[var(--shadow-card)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-[15px] font-semibold leading-tight text-[var(--text-primary)]">Sigma</div>
          <div className="text-xs leading-tight text-[var(--text-muted)]">Quality Station</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="px-2 text-xs font-medium tracking-wide text-[var(--text-faint)]">MENU</div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[var(--bg-card)] font-medium text-[var(--accent-blue)] shadow-[var(--shadow-card)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-[var(--bg-card)] p-3 shadow-[var(--shadow-card)]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-blue)]/10 text-xs font-semibold text-[var(--accent-blue)]">
          RK
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium leading-tight text-[var(--text-primary)]">Rohit Kumar</div>
          <div className="text-xs leading-tight text-[var(--text-muted)]">Operator</div>
        </div>
        <button
          type="button"
          title="Log out"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--danger)]"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
