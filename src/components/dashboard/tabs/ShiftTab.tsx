"use client";

import { useMemo, useState } from "react";
import { User } from "lucide-react";
import StatCard from "../StatCard";
import StackedBarChart, { StackedBarDatum } from "../charts/StackedBarChart";
import HorizontalStackedBarChart, {
  HorizontalStackedDatum,
} from "../charts/HorizontalStackedBarChart";
import FilterDropdown from "../FilterDropdown";
import type { GlobalFilters, StatCardData } from "../types";
import { ALL_SHIFTS } from "../types";

const stats: StatCardData[] = [
  { label: "Products analyzed", value: "4,856", trend: { direction: "up", value: "22.0%" } },
  { label: "Best Performing Shift", value: "Shift A", subtitle: "Highest Output Level" },
  { label: "Average Products/ Hour", value: "10", trend: { direction: "up", value: "22.0%" } },
  { label: "Avg Session Duration", value: "12.4%", trend: { direction: "down", value: "3.0%" } },
];

const productsAnalyzed: StackedBarDatum[] = [
  { name: "SHIFT A", accepted: 1420, rejected: 100 },
  { name: "SHIFT B", accepted: 1580, rejected: 120 },
  { name: "SHIFT C", accepted: 1720, rejected: 80 },
];

const defectDistribution: HorizontalStackedDatum[] = [
  { name: "SHIFT A", ocr: 37, weight: 25, barcode: 19, crqs: 19 },
  { name: "SHIFT B", ocr: 34, weight: 28, barcode: 21, crqs: 19 },
  { name: "SHIFT C", ocr: 5, weight: 30, barcode: 50, crqs: 15 },
];

interface OperatorRow {
  operator: string;
  shift: string;
  analyzed: number;
  accepted: number;
  rejected: number;
  rejectPct: string;
  aiAccuracy: string;
  duration: string;
}

const operators: OperatorRow[] = [
  { operator: "Rohit Kumar", shift: "A", analyzed: 10, accepted: 6, rejected: 4, rejectPct: "4%", aiAccuracy: "93.4%", duration: "27m 12s" },
  { operator: "Amit Kumar", shift: "A", analyzed: 5, accepted: 4, rejected: 1, rejectPct: "10%", aiAccuracy: "99.8%", duration: "27m 12s" },
  { operator: "Neha Singh", shift: "B", analyzed: 210, accepted: 200, rejected: 10, rejectPct: "3%", aiAccuracy: "95.6%", duration: "27m 12s" },
  { operator: "Rahul Verma", shift: "B", analyzed: 9, accepted: 7, rejected: 2, rejectPct: "21%", aiAccuracy: "90.3%", duration: "27m 12s" },
  { operator: "Rohit Kumar", shift: "C", analyzed: 11, accepted: 8, rejected: 2, rejectPct: "19%", aiAccuracy: "90.3%", duration: "27m 12s" },
  { operator: "Amit Sharma", shift: "C", analyzed: 13, accepted: 13, rejected: 0, rejectPct: "0%", aiAccuracy: "99.9%", duration: "27m 12s" },
];

const ALL_OPERATORS = "All operators";
const operatorOptions = [ALL_OPERATORS, ...Array.from(new Set(operators.map((o) => o.operator)))];

export default function ShiftTab({ filters }: { filters: GlobalFilters }) {
  const [operator, setOperator] = useState(ALL_OPERATORS);

  const shiftLetter = filters.shift.replace("Shift ", "");

  const filteredOperators = useMemo(() => {
    return operators.filter((row) => {
      if (filters.shift !== ALL_SHIFTS && row.shift !== shiftLetter) return false;
      if (operator !== ALL_OPERATORS && row.operator !== operator) return false;
      return true;
    });
  }, [filters.shift, shiftLetter, operator]);

  const filteredProductsAnalyzed = useMemo(() => {
    if (filters.shift === ALL_SHIFTS) return productsAnalyzed;
    return productsAnalyzed.filter((d) => d.name === filters.shift.toUpperCase());
  }, [filters.shift]);

  const filteredDefectDistribution = useMemo(() => {
    if (filters.shift === ALL_SHIFTS) return defectDistribution;
    return defectDistribution.filter((d) => d.name === filters.shift.toUpperCase());
  }, [filters.shift]);

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
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Operator Performance
          </h3>
          <FilterDropdown icon={User} options={operatorOptions} value={operator} onChange={setOperator} />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-faint)]">
                <th className="py-2 pr-4 font-medium">Operator</th>
                <th className="py-2 pr-4 font-medium">Shift</th>
                <th className="py-2 pr-4 text-right font-medium">Products Analyzed</th>
                <th className="py-2 pr-4 text-right font-medium">Accepted Products</th>
                <th className="py-2 pr-4 text-right font-medium">Rejected Products</th>
                <th className="py-2 pr-4 text-right font-medium">Reject %</th>
                <th className="py-2 pr-4 text-right font-medium">AI Accuracy</th>
                <th className="py-2 pr-2 text-right font-medium">Avg Session Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperators.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-sm text-[var(--text-faint)]">
                    No results
                  </td>
                </tr>
              )}
              {filteredOperators.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--bg-card-hover)]">
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{row.operator}</td>
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{row.shift}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.analyzed}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.accepted}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.rejected}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.rejectPct}</td>
                  <td className="py-3 pr-4 text-right text-[var(--text-primary)]">{row.aiAccuracy}</td>
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
