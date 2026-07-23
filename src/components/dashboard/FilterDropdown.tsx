"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterDropdown({
  icon: Icon,
  options,
  value,
  onChange,
  className = "",
}: {
  icon?: React.ComponentType<{ className?: string }>;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg bg-[var(--bg-card)] px-3.5 py-2 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-[var(--bg-card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)]"
      >
        {Icon && <Icon className="h-4 w-4 text-[var(--text-muted)]" />}
        {value}
        <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg bg-[var(--bg-card)] py-1 shadow-[var(--shadow-card-strong)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-3.5 py-2 text-left text-sm hover:bg-[var(--bg-card-hover)] ${
                option === value
                  ? "font-medium text-[var(--accent-blue)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
