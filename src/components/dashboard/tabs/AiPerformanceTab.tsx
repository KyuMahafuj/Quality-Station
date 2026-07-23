"use client";

import { Lightbulb } from "lucide-react";
import StatCard from "../StatCard";
import GaugeChart from "../charts/GaugeChart";
import type { StatCardData } from "../types";

const stats: StatCardData[] = [
  { label: "Total Observations", value: "12,458", subtitle: "All Observations Analyzed" },
  { label: "True Positives", value: "9,842", trend: { direction: "up", value: "78.9%", suffix: "of Total" } },
  { label: "False Positives", value: "1,231", trend: { direction: "down", value: "9.9%", suffix: "of Total" } },
  { label: "True Negatives", value: "842", trend: { direction: "up", value: "6.8%", suffix: "of Total" } },
  { label: "False Negatives", value: "543", trend: { direction: "down", value: "4.4%", suffix: "of Total" } },
];

interface MetricRow {
  metric: string;
  totalObs: string;
  truePos: string;
  trueNeg: string;
  falsePos: string;
  falseNeg: string;
  recall: string;
  precision: string;
  bold?: boolean;
}

const metrics: MetricRow[] = [
  { metric: "OCR", totalObs: "5,000", truePos: "2,184", trueNeg: "2,510", falsePos: "106", falseNeg: "200", recall: "91.61%", precision: "95.37%" },
  { metric: "Weight", totalObs: "4,800", truePos: "1,965", trueNeg: "2,540", falsePos: "95", falseNeg: "200", recall: "90.76%", precision: "95.39%" },
  { metric: "Barcode", totalObs: "6,200", truePos: "2,875", trueNeg: "3,030", falsePos: "125", falseNeg: "170", recall: "94.41%", precision: "95.83%" },
  { metric: "CRQS", totalObs: "4,500", truePos: "1,740", trueNeg: "2,520", falsePos: "80", falseNeg: "160", recall: "91.58%", precision: "95.60%" },
  { metric: "Total", totalObs: "12,458", truePos: "9,842", trueNeg: "1,231", falsePos: "842", falseNeg: "543", recall: "91.8%", precision: "91.8%", bold: true },
];

export default function AiPerformanceTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-6 text-base font-semibold text-[var(--text-primary)]">
            Model Performance
          </h3>
          <div className="flex flex-col gap-10">
            <GaugeChart
              title="Recall"
              value={91.8}
              color="#027a48"
              subtitle="Accuracy"
              badge="Excellent"
            />
            <GaugeChart
              title="Precision"
              value={91.8}
              color="#0155fb"
              subtitle="Accuracy"
              badge="Excellent"
            />
          </div>
        </div>

        <div className="relative col-span-2 rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Metric Wise Performance
            </h3>
            <div className="rounded-lg bg-[var(--bg-card-hover)] px-3 py-1.5 text-right text-[10px] leading-tight text-[var(--text-muted)] shadow-[var(--shadow-card)]">
              <div className="font-semibold text-[var(--text-primary)]">PRECISION</div>
              <div>TP / (TP + FP)</div>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-faint)]">
                  <th className="py-2 pr-4 font-medium">Metrics</th>
                  <th className="py-2 pr-4 text-right font-medium">Total Obser.</th>
                  <th className="py-2 pr-4 text-right font-medium">True +ve</th>
                  <th className="py-2 pr-4 text-right font-medium">True -ve</th>
                  <th className="py-2 pr-4 text-right font-medium">False +ve</th>
                  <th className="py-2 pr-4 text-right font-medium">False -ve</th>
                  <th className="py-2 pr-4 text-right font-medium">Recall (i)</th>
                  <th className="py-2 pr-2 text-right font-medium">Precision (i)</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((row) => (
                  <tr
                    key={row.metric}
                    className={`hover:bg-[var(--bg-card-hover)] ${row.bold ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}
                  >
                    <td className="py-3 pr-4">{row.metric}</td>
                    <td className="py-3 pr-4 text-right">{row.totalObs}</td>
                    <td className="py-3 pr-4 text-right">{row.truePos}</td>
                    <td className="py-3 pr-4 text-right">{row.trueNeg}</td>
                    <td className="py-3 pr-4 text-right">{row.falsePos}</td>
                    <td className="py-3 pr-4 text-right">{row.falseNeg}</td>
                    <td className="py-3 pr-4 text-right">{row.recall}</td>
                    <td className="py-3 pr-2 text-right">{row.precision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-inset)]">
          <Lightbulb className="h-4.5 w-4.5 text-[#d07601]" />
        </span>
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            About the Metrics
          </div>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
            <span>
              <b className="text-[var(--text-primary)]">True +ve (TP)</b>: Defect Correctly
              Identified
            </span>
            <span>|</span>
            <span>
              <b className="text-[var(--text-primary)]">True -ve (TN)</b>: Good Product
              Correctly Identified
            </span>
            <span>|</span>
            <span>
              <b className="text-[var(--text-primary)]">False +ve (FP)</b>: Good Product
              correctly flagged as defect
            </span>
            <span>|</span>
            <span>
              <b className="text-[var(--text-primary)]">False -ve (FN)</b>: Defect missed
              by AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
