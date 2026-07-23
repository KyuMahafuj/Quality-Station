"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, UploadCloud } from "lucide-react";

export type WeightConfig = { nominal: string; min: string; max: string };
export type CodingConfig = {
  factoryCode: string;
  barcodeFormat: string;
  mrp: string;
  usp: string;
  dateFormat: string;
  bestBefore: string;
};

export type BasicInfo = { name: string; variant: string; cbuCode: string };

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-[var(--text-primary)]">
        {label}
        {required && <span className="text-[var(--danger)]"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-[var(--bg-inset)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-faint)] focus:shadow-[0_0_0_2px_var(--accent-blue)]"
      />
    </label>
  );
}

function AccordionSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[var(--bg-page)] shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        )}
      </button>
      {expanded && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export default function ProductDetailsStep({
  basicInfo,
  onBasicInfoChange,
  weight,
  onWeightChange,
  coding,
  onCodingChange,
}: {
  basicInfo: BasicInfo;
  onBasicInfoChange: (v: BasicInfo) => void;
  weight: WeightConfig;
  onWeightChange: (v: WeightConfig) => void;
  coding: CodingConfig;
  onCodingChange: (v: CodingConfig) => void;
}) {
  const [expanded, setExpanded] = useState<"weight" | "coding" | null>("weight");

  function toggle(key: "weight" | "coding") {
    setExpanded((prev) => (prev === key ? null : key));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto rounded-xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Product Details</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Basic information, weight tolerances, and coding reference values.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Product name"
          required
          value={basicInfo.name}
          onChange={(v) => onBasicInfoChange({ ...basicInfo, name: v })}
          placeholder="e.g. HUL Shampoo 650ml"
        />
        <Field
          label="Variant"
          value={basicInfo.variant}
          onChange={(v) => onBasicInfoChange({ ...basicInfo, variant: v })}
          placeholder="e.g. Anti-dandruff"
        />
        <Field
          label="CBU Code"
          value={basicInfo.cbuCode}
          onChange={(v) => onBasicInfoChange({ ...basicInfo, cbuCode: v })}
          placeholder="e.g. SH-650-001"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-[var(--text-primary)]">Product Image</span>
        <button
          type="button"
          className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-lg bg-[var(--bg-inset)] text-[var(--text-faint)] hover:text-[var(--text-muted)]"
        >
          <UploadCloud className="h-5 w-5" />
          <span className="text-[10px]">Tap to upload</span>
        </button>
      </div>

      <AccordionSection title="Weight Configuration" expanded={expanded === "weight"} onToggle={() => toggle("weight")}>
        <div className="grid grid-cols-3 gap-4">
          <Field
            label="Nominal weight (g)"
            value={weight.nominal}
            onChange={(v) => onWeightChange({ ...weight, nominal: v })}
            placeholder="e.g. 150"
          />
          <Field
            label="Minimum weight (g)"
            value={weight.min}
            onChange={(v) => onWeightChange({ ...weight, min: v })}
            placeholder="e.g. 140"
          />
          <Field
            label="Maximum weight (g)"
            value={weight.max}
            onChange={(v) => onWeightChange({ ...weight, max: v })}
            placeholder="e.g. 160"
          />
        </div>
      </AccordionSection>

      <AccordionSection title="Coding Configuration" expanded={expanded === "coding"} onToggle={() => toggle("coding")}>
        <div className="grid grid-cols-3 gap-4">
          <Field
            label="Factory Code"
            value={coding.factoryCode}
            onChange={(v) => onCodingChange({ ...coding, factoryCode: v })}
            placeholder="e.g. HUL-"
          />
          <Field
            label="Barcode format"
            value={coding.barcodeFormat}
            onChange={(v) => onCodingChange({ ...coding, barcodeFormat: v })}
            placeholder="e.g. mm/yy"
          />
          <Field
            label="MRP"
            value={coding.mrp}
            onChange={(v) => onCodingChange({ ...coding, mrp: v })}
            placeholder="e.g. ₹100"
          />
          <Field
            label="USP"
            value={coding.usp}
            onChange={(v) => onCodingChange({ ...coding, usp: v })}
            placeholder="e.g. ₹10.8/ml"
          />
          <Field
            label="Mfg & Exp Date Format"
            value={coding.dateFormat}
            onChange={(v) => onCodingChange({ ...coding, dateFormat: v })}
            placeholder="e.g. mm/yy"
          />
          <Field
            label="Best Before"
            value={coding.bestBefore}
            onChange={(v) => onCodingChange({ ...coding, bestBefore: v })}
            placeholder="e.g. 18 Months"
          />
        </div>
      </AccordionSection>
    </div>
  );
}
