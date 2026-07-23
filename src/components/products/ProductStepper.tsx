import { Check } from "lucide-react";

export const PRODUCT_STEPS = ["Choose Category", "Product Details", "Review & Save"] as const;

export default function ProductStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {PRODUCT_STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && <span className="h-px w-6 bg-[var(--text-faint)]/30" />}
            <div className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                  done
                    ? "bg-[var(--success)] text-white"
                    : active
                      ? "bg-[var(--accent-blue)] text-white"
                      : "bg-[var(--bg-inset)] text-[var(--text-faint)]"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : stepNum}
              </span>
              <span
                className={`text-sm ${
                  active ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-faint)]"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
