"use client";

export interface HorizontalStackedDatum {
  name: string;
  ocr: number;
  weight: number;
  barcode: number;
  crqs: number;
}

const segments: { key: keyof Omit<HorizontalStackedDatum, "name">; color: string; label: string }[] = [
  { key: "ocr", color: "#7162e8", label: "OCR" },
  { key: "weight", color: "#179cb3", label: "Weight" },
  { key: "barcode", color: "#d07601", label: "Barcode" },
  { key: "crqs", color: "#0155fb", label: "CRQS" },
];

export default function HorizontalStackedBarChart({
  data,
}: {
  data: HorizontalStackedDatum[];
}) {
  return (
    <div>
      <div className="mb-5 flex justify-end gap-5 text-xs text-[var(--text-muted)]">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {data.map((row) => (
          <div key={row.name} className="flex items-center gap-4">
            <div className="w-20 shrink-0 text-xs font-medium text-[var(--text-muted)]">
              {row.name}
            </div>
            <div className="flex h-9 flex-1 overflow-hidden rounded-md">
              {segments.map((s) => {
                const value = row[s.key];
                if (value <= 0) return null;
                return (
                  <div
                    key={s.key}
                    style={{ width: `${value}%`, backgroundColor: s.color }}
                    className="flex items-center justify-center text-xs font-semibold text-white"
                  >
                    {value}%
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
