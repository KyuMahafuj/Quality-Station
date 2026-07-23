"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  X,
  Plus,
  Eye,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types + mock data                                                   */
/* ------------------------------------------------------------------ */

type Status = "match" | "mismatch";

type OcrRow = {
  field: string;
  reference: string;
  detected: string;
  status: Status;
};

type DefectRow = {
  defect: string;
  detect: string;
  status: Status;
  image?: string;
};

type WeightRow = {
  field: string;
  reference: string;
  referenceSub?: string;
  detected: string;
  status: Status;
};

const INITIAL_OCR: OcrRow[] = [
  { field: "Batch No", reference: "BSH-012123232", detected: "BSH-012123232", status: "match" },
  { field: "Factory Code", reference: "B016", detected: "B016", status: "match" },
  { field: "MRP", reference: "₹200", detected: "₹210", status: "mismatch" },
  { field: "USP", reference: "₹10/gm", detected: "₹10/gm", status: "match" },
  { field: "Mfg. Date", reference: "06/26", detected: "06/26", status: "match" },
  { field: "Exp. Date", reference: "06/28", detected: "06/28", status: "match" },
];

const INITIAL_DEFECTS: DefectRow[] = [
  { defect: "Label Peel", detect: "-", status: "match" },
  { defect: "Dirt", detect: "-", status: "match" },
  { defect: "Lose Cap", detect: "-", status: "mismatch", image: "View" },
  { defect: "Label Peel", detect: "-", status: "match" },
  { defect: "Product Leak", detect: "-", status: "mismatch", image: "View" },
  { defect: "Maintain Focus", detect: "-", status: "match" },
];

const INITIAL_WEIGHT: WeightRow[] = [
  {
    field: "Weight",
    reference: "500 gms",
    referenceSub: "(490gms - 510gms)",
    detected: "450 gms",
    status: "mismatch",
  },
  { field: "Barcode", reference: "1213243546", detected: "1213243546", status: "match" },
];

type ViewAngle = "Front" | "Back" | "Top" | "Bottom" | "Left" | "Right";
const VIEW_ANGLES: ViewAngle[] = ["Front", "Back", "Top", "Bottom", "Left", "Right"];

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        status === "match" ? "bg-[var(--success)]" : "bg-[var(--danger)]"
      }`}
    />
  );
}

function SectionHeader({
  title,
  expanded,
  onToggle,
  onEdit,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between px-6 py-4">
      <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-3 text-left">
        <span className="text-base font-semibold text-[var(--text-primary)]">{title}</span>
      </button>
      <div className="flex items-center gap-2">
        {expanded && (
          <button
            type="button"
            onClick={onEdit}
            title="Edit section"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function ImagePanel({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-1 items-center justify-center rounded-lg bg-[var(--bg-page)] p-6 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-[260px] w-auto rounded-lg object-contain drop-shadow-md" />
    </div>
  );
}

function EditModal({
  title,
  onCancel,
  onSave,
  children,
}: {
  title: string;
  onCancel: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card-strong)]">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Edit {title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto px-6 pb-2">{children}</div>
        <div className="flex justify-end gap-2 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-[var(--bg-inset)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[#0146d1]"
          >
            <Check className="h-3.5 w-3.5" />
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
        {label}
        {hint && <span className="ml-1.5 normal-case text-[var(--text-muted)]">{hint}</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg-page)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/30"
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

type SectionKey = "ocr" | "defects" | "weight";

export default function ValidateDetailsStep({ onSubmit }: { onSubmit: () => void }) {
  const [expandedKey, setExpandedKey] = useState<SectionKey | null>("ocr");
  const [modalKey, setModalKey] = useState<SectionKey | null>(null);

  const [ocrRows, setOcrRows] = useState<OcrRow[]>(INITIAL_OCR);
  const [defectRows, setDefectRows] = useState<DefectRow[]>(INITIAL_DEFECTS);
  const [weightRows, setWeightRows] = useState<WeightRow[]>(INITIAL_WEIGHT);

  const [ocrDraft, setOcrDraft] = useState<OcrRow[]>(INITIAL_OCR);
  const [defectDraft, setDefectDraft] = useState<DefectRow[]>(INITIAL_DEFECTS);
  const [weightDraft, setWeightDraft] = useState<WeightRow[]>(INITIAL_WEIGHT);

  const [activeAngle, setActiveAngle] = useState<ViewAngle>("Front");

  function toggle(key: SectionKey) {
    setExpandedKey((prev) => (prev === key ? null : key));
  }

  function openModal(key: SectionKey) {
    if (key === "ocr") setOcrDraft(ocrRows);
    if (key === "defects") setDefectDraft(defectRows);
    if (key === "weight") setWeightDraft(weightRows);
    setModalKey(key);
  }

  function saveOcr() {
    const recomputed = ocrDraft.map((row) => ({
      ...row,
      status: (row.detected.trim() === row.reference.trim() ? "match" : "mismatch") as Status,
    }));
    setOcrRows(recomputed);
    setModalKey(null);
  }

  function saveDefects() {
    // Defect status is a visual-inspection judgement call (pass/fail), not a
    // simple string-equality against a reference value, so we leave status
    // as previously set and only commit the edited detected text.
    setDefectRows(defectDraft);
    setModalKey(null);
  }

  function saveWeight() {
    const recomputed = weightDraft.map((row) => {
      if (row.field === "Barcode") {
        return { ...row, status: (row.detected.trim() === row.reference.trim() ? "match" : "mismatch") as Status };
      }
      // Weight has a numeric tolerance range rather than exact-match, so its
      // pass/fail can't be derived from a plain string comparison here —
      // status is left as-is for the operator to confirm.
      return row;
    });
    setWeightRows(recomputed);
    setModalKey(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-8 pb-6 pt-6">
        {/* Summary header row */}
        <div className="flex items-center justify-between rounded-xl bg-[var(--bg-card)] px-6 py-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/products/dove-front.png"
              alt="Dove Shampoo"
              className="h-12 w-12 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)] object-contain p-1"
            />
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">Dove Shampoo 180ml</div>
              <div className="text-xs text-[var(--text-muted)]">
                Batch BSH-012123232 &middot; Factory B016 &middot; Session #4821
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[var(--danger-bg)] px-3 py-1.5 text-xs font-medium text-[var(--danger)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
            3 mismatches need review
          </div>
        </div>

        {/* Validate OCR */}
        <div className="rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <SectionHeader
            title="Validate OCR"
            expanded={expandedKey === "ocr"}
            onToggle={() => toggle("ocr")}
            onEdit={() => openModal("ocr")}
          />
          {expandedKey === "ocr" && (
            <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
              <div className="flex-[1.6] overflow-x-auto rounded-lg">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                      <th className="px-4 py-3">Fields</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Detected</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrRows.map((row, i) => (
                      <tr key={row.field + i}>
                        <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.field}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)]">{row.reference}</td>
                        <td
                          className={`px-4 py-3 ${row.status === "mismatch" ? "font-medium text-[var(--danger)]" : "text-[var(--text-muted)]"}`}
                        >
                          {row.detected}
                        </td>
                        <td className="px-4 py-3">
                          <StatusDot status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ImagePanel src="/products/dove-back.png" alt="Scanned label" />
            </div>
          )}
        </div>

        {/* Detect Defects */}
        <div className="rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <SectionHeader
            title="Detect Defects"
            expanded={expandedKey === "defects"}
            onToggle={() => toggle("defects")}
            onEdit={() => openModal("defects")}
          />
          {expandedKey === "defects" && (
            <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
              <div className="flex-[1.4] overflow-x-auto rounded-lg">
                <table className="w-full min-w-[420px] text-sm">
                  <thead>
                    <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                      <th className="px-4 py-3">Defect</th>
                      <th className="px-4 py-3">Detect</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defectRows.map((row, i) => (
                      <tr key={row.defect + i}>
                        <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.defect}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)]">{row.detect}</td>
                        <td className="px-4 py-3">
                          <StatusDot status={row.status} />
                        </td>
                        <td className="px-4 py-3">
                          {row.image ? (
                            <button
                              type="button"
                              className="flex items-center gap-1 text-xs font-medium text-[var(--accent-blue)] hover:underline"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {row.image}
                            </button>
                          ) : (
                            <span className="text-[var(--text-faint)]">&mdash;</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-1 flex-col gap-4 rounded-lg bg-[var(--bg-page)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-1 items-center gap-1 rounded-lg bg-[var(--bg-card)] p-1 shadow-[0_0_0_1px_var(--border-subtle)]">
                    {VIEW_ANGLES.map((angle) => {
                      const active = angle === activeAngle;
                      const showDot = angle === "Front" || angle === "Back";
                      return (
                        <button
                          key={angle}
                          type="button"
                          onClick={() => setActiveAngle(angle)}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? "bg-[var(--text-muted)] text-white shadow-[var(--shadow-card)]"
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {angle}
                          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--accent-blue)] hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Defect
                  </button>
                </div>

                <div className="relative flex flex-1 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/products/dove-front.png"
                    alt="Product with detected defect"
                    className="h-[240px] w-auto rounded-lg object-contain drop-shadow-md"
                  />
                  <span className="absolute left-[38%] top-[30%] h-3 w-3 animate-pulse rounded-full bg-[var(--danger)] shadow-[0_0_0_4px_rgba(235,99,88,0.25)]" />
                  <div className="absolute left-[46%] top-[24%] flex w-max flex-col gap-0.5 rounded-lg bg-[var(--bg-card)] px-3 py-2 shadow-[var(--shadow-card-strong)]">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">#3 Lose Cap</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Detected on &middot; Cam 1</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Weight & Barcode */}
        <div className="rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <SectionHeader
            title="Weight & Barcode"
            expanded={expandedKey === "weight"}
            onToggle={() => toggle("weight")}
            onEdit={() => openModal("weight")}
          />
          {expandedKey === "weight" && (
            <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
              <div className="flex-[1.6] overflow-x-auto rounded-lg">
                <table className="w-full min-w-[460px] text-sm">
                  <thead>
                    <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                      <th className="px-4 py-3">Fields</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Detected</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weightRows.map((row, i) => (
                      <tr key={row.field + i}>
                        <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.field}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)]">
                          {row.reference}
                          {row.referenceSub && (
                            <div className="text-xs text-[var(--text-faint)]">{row.referenceSub}</div>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 ${row.status === "mismatch" ? "font-medium text-[var(--danger)]" : "text-[var(--text-muted)]"}`}
                        >
                          {row.detected}
                        </td>
                        <td className="px-4 py-3">
                          <StatusDot status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ImagePanel src="/products/dove-back.png" alt="Weight and barcode reference" />
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 justify-end bg-[var(--bg-page)] px-8 py-4 shadow-[var(--shadow-card-strong)]">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-lg bg-[var(--accent-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
        >
          Save Session
        </button>
      </div>

      {modalKey === "ocr" && (
        <EditModal title="Validate OCR" onCancel={() => setModalKey(null)} onSave={saveOcr}>
          {ocrDraft.map((row, i) => (
            <ModalField
              key={row.field}
              label={row.field}
              hint={`Ref: ${row.reference}`}
              value={row.detected}
              onChange={(v) => setOcrDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detected: v } : r)))}
            />
          ))}
        </EditModal>
      )}

      {modalKey === "defects" && (
        <EditModal title="Detect Defects" onCancel={() => setModalKey(null)} onSave={saveDefects}>
          {defectDraft.map((row, i) => (
            <ModalField
              key={row.defect + i}
              label={row.defect}
              value={row.detect}
              onChange={(v) => setDefectDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detect: v } : r)))}
            />
          ))}
        </EditModal>
      )}

      {modalKey === "weight" && (
        <EditModal title="Weight & Barcode" onCancel={() => setModalKey(null)} onSave={saveWeight}>
          {weightDraft.map((row, i) => (
            <ModalField
              key={row.field}
              label={row.field}
              hint={`Ref: ${row.reference}`}
              value={row.detected}
              onChange={(v) => setWeightDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detected: v } : r)))}
            />
          ))}
        </EditModal>
      )}
    </div>
  );
}
