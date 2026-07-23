export type TabKey = "overview" | "shift" | "format" | "aiPerformance";

export interface GlobalFilters {
  dateRange: string;
  shift: string;
  format: string;
}

export const ALL_SHIFTS = "All shifts";
export const ALL_FORMATS = "All formats";
export const DATE_RANGE_OPTIONS = ["Today", "Yesterday", "Last 7 days", "Last 30 days"];
export const SHIFT_OPTIONS = [ALL_SHIFTS, "Shift A", "Shift B", "Shift C"];
export const FORMAT_OPTIONS = [ALL_FORMATS, "Bottle", "Tube", "Jars", "Sachet", "Custom"];

export interface StatCardData {
  label: string;
  value: string;
  trend?: {
    direction: "up" | "down";
    value: string;
    suffix?: string;
  };
  subtitle?: string;
}
