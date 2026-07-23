export type ActivityEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  severity: "info" | "warning" | "critical";
};

export const INITIAL_ACTIVITY: ActivityEntry[] = [
  { id: "a1", timestamp: "2026-07-23 09:12", user: "Rohit Kumar", action: "Session completed", module: "New Session", details: "Dove Shampoo 180ml · Session #4821 passed", severity: "info" },
  { id: "a2", timestamp: "2026-07-23 09:05", user: "Amit Kumar", action: "Session flagged", module: "New Session", details: "MRP mismatch detected on Dove Shampoo 180ml", severity: "warning" },
  { id: "a3", timestamp: "2026-07-23 08:47", user: "Rohit Kumar", action: "Product added", module: "Products", details: "HUL Shampoo 650ml added to catalogue", severity: "info" },
  { id: "a4", timestamp: "2026-07-23 08:30", user: "Neha Singh", action: "Camera offline", module: "Dashboard", details: "Cam 2 stopped responding on line 3", severity: "critical" },
  { id: "a5", timestamp: "2026-07-22 18:22", user: "Rahul Verma", action: "User role updated", module: "User Management", details: "Amit Sharma promoted to Admin", severity: "info" },
  { id: "a6", timestamp: "2026-07-22 17:55", user: "Amit Sharma", action: "Product deleted", module: "Products", details: "Removed draft product \"Custom Product\"", severity: "warning" },
  { id: "a7", timestamp: "2026-07-22 16:10", user: "Rohit Kumar", action: "Session completed", module: "New Session", details: "Clinic Plus Cream 75gm · Session #4818 passed", severity: "info" },
  { id: "a8", timestamp: "2026-07-22 15:03", user: "Neha Singh", action: "Barcode recognition slow", module: "Dashboard", details: "Latency exceeded threshold on line 1", severity: "warning" },
];
