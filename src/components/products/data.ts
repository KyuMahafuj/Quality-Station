import type { LucideIcon } from "lucide-react";
import { Boxes } from "lucide-react";

export type CategoryName = "Bottle" | "Tube" | "Sachet" | "Jar" | "Custom";

export type CategoryOption = {
  label: string;
  value: CategoryName;
  image?: string;
  icon?: LucideIcon;
};

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "Bottles", value: "Bottle", image: "/products/category-bottles.png" },
  { label: "Tubes", value: "Tube", image: "/products/category-tubes.png" },
  { label: "Sachets", value: "Sachet", image: "/products/category-sachets.png" },
  { label: "Jars", value: "Jar", image: "/products/category-jars.png" },
  { label: "Others", value: "Custom", icon: Boxes },
];

export type Product = {
  id: string;
  name: string;
  variant: string;
  category: CategoryName;
  cbuCode: string;
  factoryCode: string;
  barcode: string;
  bestBefore: string;
  netWeight: string;
  draft?: boolean;
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "HUL Shampoo 650ml", variant: "Anti-dandruff", category: "Bottle", cbuCode: "SH-650-001", factoryCode: "B016", barcode: "1213243546", bestBefore: "18 Months", netWeight: "650 g" },
  { id: "p2", name: "Dove Shampoo 180ml", variant: "Bio Protein", category: "Bottle", cbuCode: "SH-180-014", factoryCode: "B016", barcode: "1213243547", bestBefore: "18 Months", netWeight: "180 ml" },
  { id: "p3", name: "Sunsilk Shampoo 340ml", variant: "Thick & Long", category: "Bottle", cbuCode: "SH-340-009", factoryCode: "B012", barcode: "1213243548", bestBefore: "24 Months", netWeight: "340 ml" },
  { id: "p4", name: "Clinic Plus Cream Tube", variant: "Strong & Long", category: "Tube", cbuCode: "CP-075-002", factoryCode: "B009", barcode: "1213243549", bestBefore: "12 Months", netWeight: "75 g" },
  { id: "p5", name: "Sunsilk Sachet 6ml", variant: "Thick & Long", category: "Sachet", cbuCode: "SS-006-011", factoryCode: "B012", barcode: "1213243550", bestBefore: "12 Months", netWeight: "6 ml" },
  { id: "p6", name: "Clinic Plus Sachet 5ml", variant: "Strong & Long", category: "Sachet", cbuCode: "CP-005-003", factoryCode: "B009", barcode: "1213243551", bestBefore: "12 Months", netWeight: "5 ml" },
  { id: "p7", name: "Glow & Lovely Jar 50g", variant: "Advanced Multivitamin", category: "Jar", cbuCode: "GL-050-007", factoryCode: "B004", barcode: "1213243552", bestBefore: "24 Months", netWeight: "50 g" },
  { id: "p8", name: "Custom Product", variant: "Unlisted SKU", category: "Custom", cbuCode: "-", factoryCode: "-", barcode: "-", bestBefore: "-", netWeight: "-", draft: true },
];
