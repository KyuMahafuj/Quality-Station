"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download, Upload, Pencil, Trash2, ShoppingBag } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { CATEGORY_OPTIONS, INITIAL_PRODUCTS, type Product } from "@/components/products/data";

const TABS = [
  { key: "All", label: "All" },
  { key: "Bottle", label: "Bottle" },
  { key: "Tube", label: "Tube" },
  { key: "Sachet", label: "Sachet" },
  { key: "Jar", label: "Jar" },
  { key: "Custom", label: "Custom" },
  { key: "Drafts", label: "Drafts" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function categoryIcon(category: Product["category"]) {
  return CATEGORY_OPTIONS.find((c) => c.value === category);
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<TabKey>("All");

  const counts = useMemo(() => {
    const byCategory: Record<string, number> = { All: products.length, Drafts: 0 };
    for (const p of products) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
      if (p.draft) byCategory.Drafts += 1;
    }
    return byCategory;
  }, [products]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return products;
    if (activeTab === "Drafts") return products.filter((p) => p.draft);
    return products.filter((p) => p.category === activeTab);
  }, [products, activeTab]);

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-y-auto px-8 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Hi, Rohit Kumar</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Track, manage and forecast your quality sessions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => router.push("/products/new")}
              className="flex items-center gap-2 rounded-lg bg-[var(--accent-blue)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-card)] p-1 shadow-[var(--shadow-card)]">
            {TABS.map((tab) => {
              const active = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    active
                      ? "bg-[var(--accent-blue)] text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                      active ? "bg-white/25 text-white" : "bg-[var(--bg-inset)] text-[var(--text-faint)]"
                    }`}
                  >
                    {counts[tab.key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-[var(--bg-card-hover)]"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-[var(--bg-card-hover)]"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">CBU Code</th>
                <th className="px-4 py-3">Factory Code</th>
                <th className="px-4 py-3">Barcode</th>
                <th className="px-4 py-3">Best Before</th>
                <th className="px-4 py-3">Net Weight</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-[var(--text-faint)]">
                    No products in this category yet.
                  </td>
                </tr>
              )}
              {filtered.map((product) => {
                const cat = categoryIcon(product.category);
                const Icon = cat?.icon ?? ShoppingBag;
                return (
                  <tr key={product.id} className="hover:bg-[var(--bg-card-hover)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--info-bg)] text-[var(--accent-blue)]">
                          {cat?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cat.image} alt="" className="h-5 w-5 object-contain" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </span>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{product.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{product.variant}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success)]/10 px-2.5 py-1 text-xs font-medium text-[var(--success)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">{product.cbuCode}</td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">{product.factoryCode}</td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">{product.barcode}</td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">{product.bestBefore}</td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">{product.netWeight}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Edit product"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete product"
                          onClick={() => deleteProduct(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
