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
  manual: string;
  status: Status;
};

type DefectRow = {
  defect: string;
  detect: string;
  manual: string;
  status: Status;
  image?: string;
};

type WeightRow = {
  field: string;
  reference: string;
  referenceSub?: string;
  detected: string;
  manual: string;
  status: Status;
};

const INITIAL_OCR: OcrRow[] = [
  { field: "Batch No", reference: "BSH-012123232", detected: "BSH-012123232", manual: "-", status: "match" },
  { field: "Factory Code", reference: "B016", detected: "B016", manual: "-", status: "match" },
  { field: "MRP", reference: "₹200", detected: "₹210", manual: "-", status: "mismatch" },
  { field: "USP", reference: "₹10/gm", detected: "₹10/gm", manual: "-", status: "match" },
  { field: "Mfg. Date", reference: "06/26", detected: "06/26", manual: "-", status: "match" },
  { field: "Exp. Date", reference: "06/28", detected: "06/28", manual: "07/26", status: "match" },
];

const INITIAL_DEFECTS: DefectRow[] = [
  { defect: "Label Peel", detect: "-", manual: "-", status: "match" },
  { defect: "Dirt", detect: "-", manual: "-", status: "match" },
  { defect: "Lose Cap", detect: "-", manual: "-", status: "mismatch", image: "View" },
  { defect: "Label Peel", detect: "-", manual: "-", status: "match" },
  { defect: "Product Leak", detect: "-", manual: "07/26", status: "mismatch", image: "View" },
  { defect: "Maintain Focus", detect: "-", manual: "-", status: "match" },
];

const INITIAL_WEIGHT: WeightRow[] = [
  {
    field: "Weight",
    reference: "500 gms",
    referenceSub: "(490gms - 510gms)",
    detected: "450 gms",
    manual: "-",
    status: "mismatch",
  },
  { field: "Barcode", reference: "1213243546", detected: "1213243546", manual: "-", status: "match" },
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

function EditableCell({
  value,
  onChange,
  danger,
}: {
  value: string;
  onChange: (v: string) => void;
  danger?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full min-w-[90px] rounded-md border bg-[var(--bg-card)] px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/30 ${
        danger
          ? "border-[var(--danger)] text-[var(--danger)]"
          : "border-[var(--border-strong)] text-[var(--text-primary)]"
      }`}
    />
  );
}

function SectionHeader({
  title,
  expanded,
  editing,
  onToggle,
  onEditToggle,
  onSave,
  onCancel,
}: {
  title: string;
  expanded: boolean;
  editing: boolean;
  onToggle: () => void;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between px-6 py-4">
      <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-3 text-left">
        <span className="text-base font-semibold text-[var(--text-primary)]">{title}</span>
      </button>
      <div className="flex items-center gap-2">
        {expanded && editing && (
          <>
            <button
              type="button"
              onClick={onSave}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-blue)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0146d1]"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--bg-inset)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </>
        )}
        {expanded && !editing && (
          <button
            type="button"
            onClick={onEditToggle}
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
      className={`flex flex-1 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)] p-6 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-[260px] w-auto rounded-lg object-contain drop-shadow-md" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

type SectionKey = "ocr" | "defects" | "weight";

export default function ValidateDetailsStep({ onSubmit }: { onSubmit: () => void }) {
  const [expandedKey, setExpandedKey] = useState<SectionKey | null>("ocr");
  const [editing, setEditing] = useState<Record<SectionKey, boolean>>({
    ocr: false,
    defects: false,
    weight: false,
  });

  // committed data
  const [ocrRows, setOcrRows] = useState<OcrRow[]>(INITIAL_OCR);
  const [defectRows, setDefectRows] = useState<DefectRow[]>(INITIAL_DEFECTS);
  const [weightRows, setWeightRows] = useState<WeightRow[]>(INITIAL_WEIGHT);

  // working copies used while editing
  const [ocrDraft, setOcrDraft] = useState<OcrRow[]>(INITIAL_OCR);
  const [defectDraft, setDefectDraft] = useState<DefectRow[]>(INITIAL_DEFECTS);
  const [weightDraft, setWeightDraft] = useState<WeightRow[]>(INITIAL_WEIGHT);

  const [activeAngle, setActiveAngle] = useState<ViewAngle>("Front");

  function toggle(key: SectionKey) {
    setExpandedKey((prev) => (prev === key ? null : key));
  }

  function startEdit(key: SectionKey) {
    if (key === "ocr") setOcrDraft(ocrRows);
    if (key === "defects") setDefectDraft(defectRows);
    if (key === "weight") setWeightDraft(weightRows);
    setEditing((prev) => ({ ...prev, [key]: true }));
  }

  function cancelEdit(key: SectionKey) {
    setEditing((prev) => ({ ...prev, [key]: false }));
  }

  function saveOcr() {
    const recomputed = ocrDraft.map((row) => ({
      ...row,
      status: (row.detected.trim() === row.reference.trim() ? "match" : "mismatch") as Status,
    }));
    setOcrRows(recomputed);
    setEditing((prev) => ({ ...prev, ocr: false }));
  }

  function saveDefects() {
    // Defect status is a visual-inspection judgement call (pass/fail), not a
    // simple string-equality against a reference value, so we leave status
    // as previously set and only commit the edited detect/manual text.
    setDefectRows(defectDraft);
    setEditing((prev) => ({ ...prev, defects: false }));
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
    setEditing((prev) => ({ ...prev, weight: false }));
  }

  return (
    <div className="flex flex-col gap-5 px-8 pb-10 pt-6">
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
          editing={editing.ocr}
          onToggle={() => toggle("ocr")}
          onEditToggle={() => startEdit("ocr")}
          onSave={saveOcr}
          onCancel={() => cancelEdit("ocr")}
        />
        {expandedKey === "ocr" && (
          <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
            <div className="flex-[1.6] overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)]">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                    <th className="px-4 py-3">Fields</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Detected</th>
                    <th className="px-4 py-3">Manual</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(editing.ocr ? ocrDraft : ocrRows).map((row, i) => (
                    <tr key={row.field + i} className="shadow-[0_-1px_0_0_var(--border-subtle)]">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.field}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{row.reference}</td>
                      <td className={`px-4 py-3 ${row.status === "mismatch" && !editing.ocr ? "font-medium text-[var(--danger)]" : "text-[var(--text-muted)]"}`}>
                        {editing.ocr ? (
                          <EditableCell
                            value={row.detected}
                            danger={row.detected.trim() !== row.reference.trim()}
                            onChange={(v) =>
                              setOcrDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detected: v } : r)))
                            }
                          />
                        ) : (
                          row.detected
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-faint)]">
                        {editing.ocr ? (
                          <EditableCell
                            value={row.manual}
                            onChange={(v) =>
                              setOcrDraft((d) => d.map((r, idx) => (idx === i ? { ...r, manual: v } : r)))
                            }
                          />
                        ) : (
                          row.manual
                        )}
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
          editing={editing.defects}
          onToggle={() => toggle("defects")}
          onEditToggle={() => startEdit("defects")}
          onSave={saveDefects}
          onCancel={() => cancelEdit("defects")}
        />
        {expandedKey === "defects" && (
          <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
            <div className="flex-[1.4] overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)]">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                    <th className="px-4 py-3">Defect</th>
                    <th className="px-4 py-3">Detect</th>
                    <th className="px-4 py-3">Manual</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Image</th>
                  </tr>
                </thead>
                <tbody>
                  {(editing.defects ? defectDraft : defectRows).map((row, i) => (
                    <tr key={row.defect + i} className="shadow-[0_-1px_0_0_var(--border-subtle)]">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.defect}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">
                        {editing.defects ? (
                          <EditableCell
                            value={row.detect}
                            onChange={(v) =>
                              setDefectDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detect: v } : r)))
                            }
                          />
                        ) : (
                          row.detect
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-faint)]">
                        {editing.defects ? (
                          <EditableCell
                            value={row.manual}
                            onChange={(v) =>
                              setDefectDraft((d) => d.map((r, idx) => (idx === i ? { ...r, manual: v } : r)))
                            }
                          />
                        ) : (
                          row.manual
                        )}
                      </td>
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

            <div className="flex flex-1 flex-col gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)] p-4">
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
          editing={editing.weight}
          onToggle={() => toggle("weight")}
          onEditToggle={() => startEdit("weight")}
          onSave={saveWeight}
          onCancel={() => cancelEdit("weight")}
        />
        {expandedKey === "weight" && (
          <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
            <div className="flex-[1.6] overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)]">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                    <th className="px-4 py-3">Fields</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Detected</th>
                    <th className="px-4 py-3">Manual</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(editing.weight ? weightDraft : weightRows).map((row, i) => (
                    <tr key={row.field + i} className="shadow-[0_-1px_0_0_var(--border-subtle)]">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.field}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">
                        {row.reference}
                        {row.referenceSub && (
                          <div className="text-xs text-[var(--text-faint)]">{row.referenceSub}</div>
                        )}
                      </td>
                      <td className={`px-4 py-3 ${row.status === "mismatch" && !editing.weight ? "font-medium text-[var(--danger)]" : "text-[var(--text-muted)]"}`}>
                        {editing.weight ? (
                          <EditableCell
                            value={row.detected}
                            onChange={(v) =>
                              setWeightDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detected: v } : r)))
                            }
                          />
                        ) : (
                          row.detected
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-faint)]">
                        {editing.weight ? (
                          <EditableCell
                            value={row.manual}
                            onChange={(v) =>
                              setWeightDraft((d) => d.map((r, idx) => (idx === i ? { ...r, manual: v } : r)))
                            }
                          />
                        ) : (
                          row.manual
                        )}
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

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-lg bg-[var(--accent-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
        >
          Save Session
        </button>
      </div>
    </div>
  );
}
