"use client";

import { useMemo, useState } from "react";
import { Eye, User, Package, ShoppingBag } from "lucide-react";
import StatCard from "../StatCard";
import OperationalAlerts from "../OperationalAlerts";
import StackedBarChart, { StackedBarDatum } from "../charts/StackedBarChart";
import DonutChart, { DonutDatum } from "../charts/DonutChart";
import FilterDropdown from "../FilterDropdown";
import type { GlobalFilters, StatCardData } from "../types";
import { ALL_FORMATS, ALL_SHIFTS } from "../types";

const stats: StatCardData[] = [
  { label: "Products analyzed", value: "4,856", trend: { direction: "up", value: "22.0%" } },
  { label: "Good products", value: "4,256", trend: { direction: "up", value: "87.6%" } },
  { label: "Rejected products", value: "600", trend: { direction: "down", value: "12.4%" } },
  { label: "Defect rate", value: "12.4%", trend: { direction: "down", value: "3.0%" } },
  { label: "AI Accuracy", value: "94.3%", trend: { direction: "down", value: "3.0%" } },
];

const productsAnalyzedBase: StackedBarDatum[] = [
  { name: "11 May", accepted: 1180, rejected: 90 },
  { name: "12 May", accepted: 1340, rejected: 110 },
  { name: "13 May", accepted: 1520, rejected: 130 },
  { name: "14 May", accepted: 1460, rejected: 95 },
  { name: "15 May", accepted: 1380, rejected: 105 },
  { name: "16 May", accepted: 1420, rejected: 120 },
  { name: "17 May", accepted: 1290, rejected: 85 },
];

const defectsBreakdownBase: DonutDatum[] = [
  { name: "CRQS", value: 64, color: "#7162e8" },
  { name: "Weight", value: 38, color: "#d07601" },
  { name: "OCR", value: 13, color: "#eb6358" },
  { name: "Barcode", value: 13, color: "#179cb3" },
];

const crqsBreakdownBase: DonutDatum[] = [
  { name: "Label", value: 32, color: "#eb6358" },
  { name: "Dent", value: 34, color: "#d07601" },
  { name: "Tear", value: 30, color: "#0155fb" },
  { name: "Issue 4", value: 32, color: "#7162e8" },
];

const SHIFT_WEIGHTS: Record<string, number> = { "Shift A": 0.36, "Shift B": 0.34, "Shift C": 0.3 };
const FORMAT_WEIGHTS: Record<string, number> = {
  Bottle: 0.45,
  Tube: 0.25,
  Jars: 0.15,
  Sachet: 0.1,
  Custom: 0.05,
};

const sessions = [
  { id: "SES-240527-101", format: "Tube", product: "Clinic Plus", variant: "Strong & Long • 6ml", batch: "BCP240527A", operator: "Rohit Kumar", shift: "Shift A", result: "pass", rejection: "-" },
  { id: "SES-240527-102", format: "Bottle", product: "Dove", variant: "Bio Protein • 7ml", batch: "BDV240527B", operator: "Amit Kumar", shift: "Shift A", result: "fail", rejection: "CRQS, Weight" },
  { id: "SES-240527-103", format: "Bottle", product: "Glow & Lovely", variant: "Ayur • 25g", batch: "BGL240527C", operator: "Neha Singh", shift: "Shift B", result: "pass", rejection: "-" },
  { id: "SES-240527-104", format: "Bottle", product: "Sunsilk", variant: "Thick & Long • 5.5ml", batch: "BSS240527E", operator: "Rahul Verma", shift: "Shift B", result: "fail", rejection: "Barcode" },
  { id: "SES-240527-105", format: "Tube", product: "Tresemme", variant: "Keratin Smooth • 6.2ml", batch: "BTR240527E", operator: "Rohit Kumar", shift: "Shift A", result: "pass", rejection: "-" },
  { id: "SES-240527-106", format: "Bottle", product: "Glow & Lovely", variant: "Advanced Multivitamin • 50g", batch: "BGL240527F", operator: "Amit Sharma", shift: "Shift C", result: "fail", rejection: "OCR" },
];

const ALL_OPERATORS = "All operators";
const ALL_PRODUCTS = "All products";
const operatorOptions = [ALL_OPERATORS, ...Array.from(new Set(sessions.map((s) => s.operator)))];
const productOptions = [ALL_PRODUCTS, ...Array.from(new Set(sessions.map((s) => s.product)))];

export default function OverviewTab({ filters }: { filters: GlobalFilters }) {
  const [operator, setOperator] = useState(ALL_OPERATORS);
  const [product, setProduct] = useState(ALL_PRODUCTS);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (filters.shift !== ALL_SHIFTS && s.shift !== filters.shift) return false;
      if (filters.format !== ALL_FORMATS && s.format !== filters.format) return false;
      if (operator !== ALL_OPERATORS && s.operator !== operator) return false;
      if (product !== ALL_PRODUCTS && s.product !== product) return false;
      return true;
    });
  }, [filters.shift, filters.format, operator, product]);

  const filterWeight = useMemo(() => {
    const shiftWeight = filters.shift !== ALL_SHIFTS ? SHIFT_WEIGHTS[filters.shift] ?? 1 : 1;
    const formatWeight = filters.format !== ALL_FORMATS ? FORMAT_WEIGHTS[filters.format] ?? 1 : 1;
    return shiftWeight * formatWeight;
  }, [filters.shift, filters.format]);

  const productsAnalyzed = useMemo(
    () =>
      productsAnalyzedBase.map((d) => ({
        ...d,
        accepted: Math.max(1, Math.round(d.accepted * filterWeight)),
        rejected: Math.max(1, Math.round(d.rejected * filterWeight)),
      })),
    [filterWeight]
  );

  const defectsBreakdown = useMemo(
    () => defectsBreakdownBase.map((d) => ({ ...d, value: Math.max(1, Math.round(d.value * filterWeight)) })),
    [filterWeight]
  );

  const crqsBreakdown = useMemo(
    () => crqsBreakdownBase.map((d) => ({ ...d, value: Math.max(1, Math.round(d.value * filterWeight)) })),
    [filterWeight]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <OperationalAlerts />

      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        <div className="col-span-2 rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
            Products Analyzed
          </h3>
          <StackedBarChart data={productsAnalyzed} />
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
            Defects Breakdown{" "}
            <span className="text-xs font-normal text-[var(--text-faint)]">(% of Rejects)</span>
          </h3>
          <DonutChart data={defectsBreakdown} />
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
            CRQS Breakdown{" "}
            <span className="text-xs font-normal text-[var(--text-faint)]">(% of Rejects)</span>
          </h3>
          <DonutChart data={crqsBreakdown} />
        </div>
      </div>

      <div className="rounded-xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Recent Sessions
          </h3>
          <div className="flex gap-3">
            <FilterDropdown icon={User} options={operatorOptions} value={operator} onChange={setOperator} />
            <FilterDropdown icon={ShoppingBag} options={productOptions} value={product} onChange={setProduct} />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-faint)]">
                <th className="py-2 pr-4 font-medium">Session ID</th>
                <th className="py-2 pr-4 font-medium">Format</th>
                <th className="py-2 pr-4 font-medium">Product</th>
                <th className="py-2 pr-4 font-medium">Variant</th>
                <th className="py-2 pr-4 font-medium">Batch No</th>
                <th className="py-2 pr-4 font-medium">Operator</th>
                <th className="py-2 pr-4 font-medium">Result</th>
                <th className="py-2 pr-4 font-medium">Rejection</th>
                <th className="py-2 pr-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-sm text-[var(--text-faint)]">
                    No results
                  </td>
                </tr>
              )}
              {filteredSessions.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--bg-card-hover)]">
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{s.id}</td>
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{s.format}</td>
                  <td className="py-3 pr-4 text-[var(--text-primary)]">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[var(--text-muted)]" />
                      {s.product}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{s.variant}</td>
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{s.batch}</td>
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{s.operator}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        s.result === "pass" ? "bg-[var(--success)]" : "bg-[var(--danger)]"
                      }`}
                    />
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{s.rejection}</td>
                  <td className="py-3 pr-2 text-right">
                    <Eye className="ml-auto h-4 w-4 text-[var(--text-muted)]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
