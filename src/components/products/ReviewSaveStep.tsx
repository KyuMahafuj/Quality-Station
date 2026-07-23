import { CATEGORY_OPTIONS, type CategoryName } from "./data";
import type { BasicInfo, CodingConfig, WeightConfig } from "./ProductDetailsStep";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{value || "-"}</div>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[var(--bg-page)] p-5 shadow-[var(--shadow-card)]">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">{title}</span>
      <div className="grid grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

export default function ReviewSaveStep({
  category,
  basicInfo,
  weight,
  coding,
}: {
  category: CategoryName | null;
  basicInfo: BasicInfo;
  weight: WeightConfig;
  coding: CodingConfig;
}) {
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? "-";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto rounded-xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Review & Save</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Confirm the details below before saving this product.
        </p>
      </div>

      <SummarySection title="Basic Information">
        <SummaryRow label="Product name" value={basicInfo.name} />
        <SummaryRow label="Variant" value={basicInfo.variant} />
        <SummaryRow label="CBU Code" value={basicInfo.cbuCode} />
        <SummaryRow label="Category" value={categoryLabel} />
      </SummarySection>

      <SummarySection title="Weight Configuration">
        <SummaryRow label="Nominal weight" value={weight.nominal} />
        <SummaryRow label="Minimum weight" value={weight.min} />
        <SummaryRow label="Maximum weight" value={weight.max} />
      </SummarySection>

      <SummarySection title="Coding Configuration">
        <SummaryRow label="Factory Code" value={coding.factoryCode} />
        <SummaryRow label="Barcode format" value={coding.barcodeFormat} />
        <SummaryRow label="MRP" value={coding.mrp} />
        <SummaryRow label="USP" value={coding.usp} />
        <SummaryRow label="Mfg & Exp Date Format" value={coding.dateFormat} />
        <SummaryRow label="Best Before" value={coding.bestBefore} />
      </SummarySection>
    </div>
  );
}
