"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-8 w-[56px] shrink-0 items-center rounded-full bg-[#2b2f3a] p-1 transition-colors"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
          isDark ? "translate-x-[24px]" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-[#2b2f3a]" fill="currentColor" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-[#2b2f3a]" />
        )}
      </span>
    </button>
  );
}
