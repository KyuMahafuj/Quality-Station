"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/dashboard/ThemeToggle";

export default function StepperHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-8 pt-6">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <ThemeToggle />
    </div>
  );
}
