"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
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

type Rect = { x: number; y: number; w: number; h: number };

type DefectImage = { id: string; src: string; rect: Rect };

type DefectRow = {
  id: string;
  defect: string;
  images: DefectImage[];
};

type WeightRow = {
  field: string;
  reference: string;
  referenceSub?: string;
  detected: string;
  status: Status;
};

type CapturedImage = { label: string; src: string };

const INITIAL_OCR: OcrRow[] = [
  { field: "Batch No", reference: "BSH-012123232", detected: "BSH-012123232", status: "match" },
  { field: "Factory Code", reference: "B016", detected: "B016", status: "match" },
  { field: "MRP", reference: "₹200", detected: "₹210", status: "mismatch" },
  { field: "USP", reference: "₹10/gm", detected: "₹10/gm", status: "match" },
  { field: "Mfg. Date", reference: "06/26", detected: "06/26", status: "match" },
  { field: "Exp. Date", reference: "06/28", detected: "06/28", status: "match" },
];

const INITIAL_DEFECTS: DefectRow[] = [
  { id: "d1", defect: "Label Peel", images: [] },
  { id: "d2", defect: "Dirt", images: [] },
  {
    id: "d3",
    defect: "Lose Cap",
    images: [
      { id: "d3-1", src: "/products/dove-front.png", rect: { x: 36, y: 6, w: 26, h: 20 } },
      { id: "d3-2", src: "/products/dove-back.png", rect: { x: 22, y: 8, w: 22, h: 18 } },
    ],
  },
  { id: "d4", defect: "Label Peel", images: [] },
  {
    id: "d5",
    defect: "Product Leak",
    images: [{ id: "d5-1", src: "/products/dove-back.png", rect: { x: 30, y: 45, w: 32, h: 22 } }],
  },
  { id: "d6", defect: "Maintain Focus", images: [] },
];

function statusOf(row: DefectRow): Status {
  return row.images.length > 0 ? "mismatch" : "match";
}

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

const CAPTURED_IMAGES: CapturedImage[] = [
  { label: "Front", src: "/products/dove-front.png" },
  { label: "Back", src: "/products/dove-back.png" },
];

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block h-4 w-4 rounded-full ${
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
  onEdit?: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between px-6 py-4">
      <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-3 text-left">
        <span className="text-base font-semibold text-[var(--text-primary)]">{title}</span>
      </button>
      <div className="flex items-center gap-2">
        {expanded && onEdit && (
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
  wide = false,
  children,
}: {
  title: string;
  onCancel: () => void;
  onSave: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`flex max-h-[85vh] w-full ${wide ? "max-w-2xl" : "max-w-lg"} flex-col rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card-strong)]`}
      >
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
        <div className="flex flex-col gap-3 overflow-y-auto px-6 py-4">{children}</div>
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
  reference,
  value,
  onChange,
}: {
  label: string;
  reference?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isMatch = reference !== undefined && value.trim() === reference.trim();

  return (
    <div className="relative flex items-end gap-4 overflow-hidden rounded-lg bg-[var(--bg-page)] p-3 pl-4 shadow-[var(--shadow-card)]">
      {reference !== undefined && (
        <span
          className={`absolute inset-y-0 left-0 w-1 ${isMatch ? "bg-[var(--success)]" : "bg-[var(--danger)]"}`}
        />
      )}
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">{label}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)] outline-none transition-shadow focus:shadow-[0_0_0_2px_var(--accent-blue)]"
        />
      </label>
      {reference && (
        <div className="flex w-28 shrink-0 flex-col items-end gap-1.5 pb-2 text-right">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">Reference</span>
          <span className="text-sm font-medium text-[var(--text-muted)]">{reference}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Defect marking editor                                               */
/* ------------------------------------------------------------------ */

function RectEditor({
  src,
  rects,
  onChange,
}: {
  src: string;
  rects: Rect[];
  onChange: (rects: Rect[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<Rect | null>(null);

  function pointFromEvent(e: React.MouseEvent) {
    const bounds = containerRef.current!.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - bounds.top) / bounds.height) * 100));
    return { x, y };
  }

  function handleDown(e: React.MouseEvent) {
    const p = pointFromEvent(e);
    setStart(p);
    setDraft({ x: p.x, y: p.y, w: 0, h: 0 });
  }

  function handleMove(e: React.MouseEvent) {
    if (!start) return;
    const p = pointFromEvent(e);
    setDraft({
      x: Math.min(start.x, p.x),
      y: Math.min(start.y, p.y),
      w: Math.abs(p.x - start.x),
      h: Math.abs(p.y - start.y),
    });
  }

  function handleUp() {
    setStart(null);
    if (draft && draft.w > 1.5 && draft.h > 1.5) {
      onChange([...rects, draft]);
    }
    setDraft(null);
  }

  function removeRect(idx: number) {
    onChange(rects.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div
        ref={containerRef}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        className="relative h-[320px] w-full cursor-crosshair select-none overflow-hidden rounded-lg bg-[var(--bg-page)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} className="pointer-events-none h-full w-full object-contain" />
        {rects.map((r, idx) => (
          <div
            key={idx}
            className="absolute rounded-sm bg-[var(--danger)]/15 shadow-[0_0_0_2px_var(--danger)]"
            style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
          >
            <button
              type="button"
              onClick={() => removeRect(idx)}
              title="Remove this rectangle"
              className="absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--danger)] text-white shadow-[var(--shadow-card)] hover:bg-[#c94f45]"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {draft && draft.w > 0.5 && draft.h > 0.5 && (
          <div
            className="pointer-events-none absolute rounded-sm bg-[var(--danger)]/15 shadow-[0_0_0_2px_var(--danger)]"
            style={{ left: `${draft.x}%`, top: `${draft.y}%`, width: `${draft.w}%`, height: `${draft.h}%` }}
          />
        )}
      </div>
      <p className="mt-2 text-xs text-[var(--text-muted)]">
        {rects.length > 0
          ? `${rects.length} area${rects.length > 1 ? "s" : ""} marked — hover a box and click × to remove it.`
          : "Drag on the image to mark a defect area. You can draw multiple boxes."}
      </p>
    </div>
  );
}

function DefectCrop({ src, rect }: { src: string; rect: Rect }) {
  const size = Math.max(rect.w, rect.h, 5);
  const scale = 100 / size;
  const left = 50 - (rect.x + rect.w / 2) * scale;
  const top = 50 - (rect.y + rect.h / 2) * scale;
  return (
    <div className="relative h-[280px] w-[220px] overflow-hidden rounded-lg bg-[var(--bg-page)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute max-w-none"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

type SectionKey = "ocr" | "defects" | "weight";

export default function ValidateDetailsStep({ onSubmit }: { onSubmit: () => void }) {
  const [expandedKey, setExpandedKey] = useState<SectionKey | null>("weight");
  const [modalKey, setModalKey] = useState<SectionKey | null>(null);

  const [ocrRows, setOcrRows] = useState<OcrRow[]>(INITIAL_OCR);
  const [defectRows, setDefectRows] = useState<DefectRow[]>(INITIAL_DEFECTS);
  const [weightRows, setWeightRows] = useState<WeightRow[]>(INITIAL_WEIGHT);

  const [ocrDraft, setOcrDraft] = useState<OcrRow[]>(INITIAL_OCR);
  const [weightDraft, setWeightDraft] = useState<WeightRow[]>(INITIAL_WEIGHT);

  const [activeDefectImage, setActiveDefectImage] = useState(0);

  const [markingDefectId, setMarkingDefectId] = useState<string | null>(null);
  const [markingImageIdx, setMarkingImageIdx] = useState(0);
  const [markingRectsByImage, setMarkingRectsByImage] = useState<Record<number, Rect[]>>({});
  const markingRects = markingRectsByImage[markingImageIdx] ?? [];

  const [confirmDelete, setConfirmDelete] = useState<{ defectId: string; imageId: string } | null>(null);

  const allDefectImages = defectRows.flatMap((row) =>
    row.images.map((img) => ({ defectId: row.id, defectName: row.defect, ...img }))
  );

  function toggle(key: SectionKey) {
    setExpandedKey((prev) => (prev === key ? null : key));
  }

  function openModal(key: SectionKey) {
    if (key === "ocr") setOcrDraft(ocrRows);
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

  function saveWeight() {
    const recomputed = weightDraft.map((row) => {
      if (row.field === "Barcode") {
        return { ...row, status: (row.detected.trim() === row.reference.trim() ? "match" : "mismatch") as Status };
      }
      return row;
    });
    setWeightRows(recomputed);
    setModalKey(null);
  }

  function openMarking(row: DefectRow) {
    setMarkingDefectId(row.id);
    setMarkingImageIdx(0);
    setMarkingRectsByImage({});
  }

  function switchMarkingImage(idx: number) {
    setMarkingImageIdx(idx);
  }

  function setRectsForActiveImage(rects: Rect[]) {
    setMarkingRectsByImage((prev) => ({ ...prev, [markingImageIdx]: rects }));
  }

  function saveMarking() {
    const entries = Object.entries(markingRectsByImage).flatMap(([idxStr, rects]) =>
      rects.map((rect) => ({ src: CAPTURED_IMAGES[Number(idxStr)].src, rect }))
    );
    if (!markingDefectId || entries.length === 0) {
      setMarkingDefectId(null);
      return;
    }
    setDefectRows((rows) =>
      rows.map((r) =>
        r.id === markingDefectId
          ? {
              ...r,
              images: [
                ...r.images,
                ...entries.map((entry, i) => ({
                  id: `${r.id}-${r.images.length + i + 1}`,
                  src: entry.src,
                  rect: entry.rect,
                })),
              ],
            }
          : r
      )
    );
    setMarkingDefectId(null);
  }

  function requestDeleteImage(defectId: string, imageId: string) {
    setConfirmDelete({ defectId, imageId });
  }

  function confirmDeleteImage() {
    if (!confirmDelete) return;
    setDefectRows((rows) =>
      rows.map((r) =>
        r.id === confirmDelete.defectId ? { ...r, images: r.images.filter((img) => img.id !== confirmDelete.imageId) } : r
      )
    );
    setActiveDefectImage(0);
    setConfirmDelete(null);
  }

  const activeDefect = allDefectImages[activeDefectImage];

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
              className="h-12 w-12 rounded-lg bg-[var(--bg-inset)] object-contain p-1"
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

        {/* Weight & Barcode Analysis */}
        <div className="rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <SectionHeader
            title="Weight and Barcode Analysis"
            expanded={expandedKey === "weight"}
            onToggle={() => toggle("weight")}
            onEdit={() => openModal("weight")}
          />
          {expandedKey === "weight" && (
            <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
              <div className="flex-[1.6] overflow-x-auto rounded-lg">
                <table className="w-full min-w-[460px] text-sm">
                  <thead>
                    <tr className="text-center text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                      <th className="px-4 py-3">Fields</th>
                      <th className="px-4 py-3">Detected</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weightRows.map((row, i) => (
                      <tr key={row.field + i}>
                        <td className="px-4 py-3 text-center font-medium text-[var(--text-primary)]">{row.field}</td>
                        <td
                          className={`px-4 py-3 text-center ${row.status === "mismatch" ? "font-medium text-[var(--danger)]" : "text-[var(--text-muted)]"}`}
                        >
                          {row.detected}
                        </td>
                        <td className="px-4 py-3 text-center text-[var(--text-muted)]">
                          {row.reference}
                          {row.referenceSub && (
                            <div className="text-xs text-[var(--text-faint)]">{row.referenceSub}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <StatusDot status={row.status} />
                          </div>
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

        {/* Coding Analysis */}
        <div className="rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <SectionHeader
            title="Coding Analysis"
            expanded={expandedKey === "ocr"}
            onToggle={() => toggle("ocr")}
            onEdit={() => openModal("ocr")}
          />
          {expandedKey === "ocr" && (
            <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
              <div className="flex-[1.6] overflow-x-auto rounded-lg">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="text-center text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                      <th className="px-4 py-3">Fields</th>
                      <th className="px-4 py-3">Detected</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrRows.map((row, i) => (
                      <tr key={row.field + i}>
                        <td className="px-4 py-3 text-center font-medium text-[var(--text-primary)]">{row.field}</td>
                        <td
                          className={`px-4 py-3 text-center ${row.status === "mismatch" ? "font-medium text-[var(--danger)]" : "text-[var(--text-muted)]"}`}
                        >
                          {row.detected}
                        </td>
                        <td className="px-4 py-3 text-center text-[var(--text-muted)]">{row.reference}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <StatusDot status={row.status} />
                          </div>
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

        {/* Defect Analysis */}
        <div className="rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <SectionHeader
            title="Defect Analysis"
            expanded={expandedKey === "defects"}
            onToggle={() => toggle("defects")}
          />
          {expandedKey === "defects" && (
            <div className="flex flex-col gap-6 px-6 pb-6 lg:flex-row">
              <div className="flex-[1.4] overflow-x-auto rounded-lg">
                <table className="w-full min-w-[360px] text-sm">
                  <thead>
                    <tr className="text-center text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                      <th className="px-4 py-3">Defect</th>
                      <th className="px-4 py-3">Count</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defectRows.map((row, i) => (
                      <tr key={row.id + i}>
                        <td className="px-4 py-3 text-center font-medium text-[var(--text-primary)]">{row.defect}</td>
                        <td className="px-4 py-3 text-center text-[var(--text-muted)]">{row.images.length}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <StatusDot status={statusOf(row)} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => openMarking(row)}
                              title="Mark defect area"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-1 flex-col items-center gap-3 rounded-lg bg-[var(--bg-page)] p-4">
                {activeDefect ? (
                  <>
                    <div className="flex w-full items-center justify-between px-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{activeDefect.defectName}</span>
                      <button
                        type="button"
                        onClick={() => requestDeleteImage(activeDefect.defectId, activeDefect.id)}
                        title="Delete this image"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDefectImage((i) => (i - 1 + allDefectImages.length) % allDefectImages.length)
                        }
                        disabled={allDefectImages.length < 2}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] shadow-[var(--shadow-card)] hover:text-[var(--text-primary)] disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <DefectCrop src={activeDefect.src} rect={activeDefect.rect} />
                      <button
                        type="button"
                        onClick={() => setActiveDefectImage((i) => (i + 1) % allDefectImages.length)}
                        disabled={allDefectImages.length < 2}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] shadow-[var(--shadow-card)] hover:text-[var(--text-primary)] disabled:opacity-40"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {activeDefectImage + 1} of {allDefectImages.length}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-[var(--text-faint)]">No defect images captured</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 justify-end bg-[var(--bg-page)] px-8 py-4">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-lg bg-[var(--accent-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
        >
          Save Session
        </button>
      </div>

      {modalKey === "ocr" && (
        <EditModal title="Coding Analysis" onCancel={() => setModalKey(null)} onSave={saveOcr}>
          {ocrDraft.map((row, i) => (
            <ModalField
              key={row.field}
              label={row.field}
              reference={row.reference}
              value={row.detected}
              onChange={(v) => setOcrDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detected: v } : r)))}
            />
          ))}
        </EditModal>
      )}

      {modalKey === "weight" && (
        <EditModal title="Weight and Barcode Analysis" onCancel={() => setModalKey(null)} onSave={saveWeight}>
          {weightDraft.map((row, i) => (
            <ModalField
              key={row.field}
              label={row.field}
              reference={row.reference}
              value={row.detected}
              onChange={(v) => setWeightDraft((d) => d.map((r, idx) => (idx === i ? { ...r, detected: v } : r)))}
            />
          ))}
        </EditModal>
      )}

      {markingDefectId && (
        <EditModal
          title={`Defect Area – ${defectRows.find((r) => r.id === markingDefectId)?.defect ?? ""}`}
          onCancel={() => setMarkingDefectId(null)}
          onSave={saveMarking}
          wide
        >
          <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-page)] p-1">
            {CAPTURED_IMAGES.map((img, idx) => {
              const count = markingRectsByImage[idx]?.length ?? 0;
              return (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => switchMarkingImage(idx)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    idx === markingImageIdx
                      ? "bg-[var(--text-muted)] text-white shadow-[var(--shadow-card)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {img.label}
                  {count > 0 && (
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                        idx === markingImageIdx ? "bg-white/25 text-white" : "bg-[var(--danger)] text-white"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <RectEditor
            src={CAPTURED_IMAGES[markingImageIdx].src}
            rects={markingRects}
            onChange={setRectsForActiveImage}
          />
        </EditModal>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card-strong)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Delete this image?</h3>
            <p className="text-sm text-[var(--text-muted)]">
              This defect image and its marked area will be removed. This can&rsquo;t be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg bg-[var(--bg-inset)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteImage}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--danger)] px-4 py-2 text-sm font-medium text-white hover:bg-[#c94f45]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
