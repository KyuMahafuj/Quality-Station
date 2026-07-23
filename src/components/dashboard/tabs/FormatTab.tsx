"use client";

import { useMemo } from "react";
import { Package } from "lucide-react";
import StatCard from "../StatCard";
import StackedBarChart, { StackedBarDatum } from "../charts/StackedBarChart";
import HorizontalStackedBarChart, {
  HorizontalStackedDatum,
} from "../charts/HorizontalStackedBarChart";
import type { GlobalFilters, StatCardData } from "../types";
import { ALL_FORMATS } from "../types";

const stats: StatCardData[] = [
  { label: "Products analyzed", value: "4,856", trend: { direction: "up", value: "22.0%" } },
  { label: "Best Performing Format", value: "Bottle", subtitle: "Highest Output Level" },
  { label: "Avg Session Duration", value: "12.4%", trend: { direction: "down", value: "3.0%" } },
];

const productsAnalyzed: StackedBarDatum[] = [
  { name: "BOTTLES", accepted: 1420, rejected: 100 },
  { name: "TUBES", accepted: 1600, rejected: 100 },
  { name: "JARS", accepted: 1700, rejected: 100 },
  { name: "SACHET", accepted: 1700, rejected: 100 },
  { name: "CUSTOM", accepted: 1700, rejected: 100 },
];

const defectDistribution: HorizontalStackedDatum[] = [
  { name: "BOTTLES", ocr: 37, weight: 25, barcode: 19, crqs: 19 },
  { name: "TUBES", ocr: 34, weight: 28, barcode: 21, crqs: 19 },
  { name: "JARS", ocr: 5, weight: 30, barcode: 50, crqs: 15 },
  { name: "SACHET", ocr: 5, weight: 30, barcode: 50, crqs: 15 },
  { name: "CUSTOM", ocr: 5, weight: 30, barcode: 50, crqs: 15 },
];

interface FormatRow {
  format: string;
  analyzed: number;
  accepted: number;
  rejectPct: string;
  topDefect: string;
  duration: string;
}

const formats: FormatRow[] = [
  { format: "Bottle", analyzed: 2210, accepted: 2210, rejectPct: "3.4%", topDefect: "OCR", duration: "27m 12s" },
  { format: "Tube", analyzed: 1245, accepted: 1245, rejectPct: "4.8%", topDefect: "Barcode", duration: "27m 12s" },
  { format: "Jars", analyzed: 812, accepted: 812, rejectPct: "2.1%", topDefect: "Weight", duration: "27m 12s" },
  { format: "Sachet", analyzed: 456, accepted: 456, rejectPct: "3.1%", topDefect: "Barcode", duration: "27m 12s" },
  { format: "Custom", analyzed: 133, accepted: 133, rejectPct: "5.6%", topDefect: "CRQS", duration: "27m 12s" },
];

export default function FormatTab({ filters }: { filters: GlobalFilters }) {
  const filteredFormats = useMemo(() => {
    if (filters.format === ALL_FORMATS) return formats;
    return formats.filter((row) => row.format === filters.format);
  }, [filters.format]);

  const filteredProductsAnalyzed = useMemo(() => {
    if (filters.format === ALL_FORMATS) return productsAnalyzed;
    return productsAnalyzed.filter((d) => d.name === filters.format.toUpperCase());
  }, [filters.format]);

  const filteredDefectDistribution = useMemo(() => {
    if (filters.format === ALL_FORMATS) return defectDistribution;
    return defectDistribution.filter((d) => d.name === filters.format.toUpperCase());
  }, [filters.format]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
            Products Analyzed
          </h3>
          <StackedBarChart data={filteredProductsAnalyzed} />
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
            Defect Distribution
          </h3>
          <HorizontalStackedBarChart data={filteredDefectDistribution} />
        </div>
      </div>

      <div className="rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          Format Summary
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-faint)]">
                <th className="py-2 pr-4 font-medium">Format</th>
                <th className="py-2 pr-4 text-right font-medium">Products Analyzed</th>
                <th className="py-2 pr-4 text-right font-medium">Accepted Products</th>
                <th className="py-2 pr-4 text-right font-medium">Reject %</th>
                <th className="py-2 pr-4 text-right font-medium">Top Defect</th>
                <th className="py-2 pr-2 text-right font-medium">Avg Session Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredFormats.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-[var(--text-faint)]">
                    No results
                  </td>
                </tr>
              )}
              {filteredFormats.map((row) => (
                <tr key={row.format} className="hover:bg-[var(--bg-card-hover)]">
                  <td className="py-3 pr-4 text-[var(--text-primary)]">
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-[var(--bg-inset)]">
                        <Package className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      </span>
                      {row.format}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.analyzed.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.accepted.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.rejectPct}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.topDefect}</td>
                  <td className="py-3 pr-2 text-right text-[var(--text-primary)]">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
