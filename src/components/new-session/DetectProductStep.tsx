"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Check, Circle, ArrowLeft, LayoutGrid } from "lucide-react";

type Phase = "cameras" | "idle" | "analyzing" | "manual-category" | "manual-product";

type ManualProduct = { name: string; subtitle: string; code: string };

const CATEGORIES: { name: string; image?: string; products: ManualProduct[] }[] = [
  {
    name: "Bottles",
    image: "/products/dove-front.png",
    products: [
      { name: "Clinic Plus", subtitle: "Clinic Plus Strong & Long 960x6ml", code: "-" },
      { name: "Dove", subtitle: "DV DLY SH Bio Protein CDHR 512x7ml", code: "DVRK2R0" },
      { name: "Sunsilk", subtitle: "SS TK&LG SHP 5.5ml-x960-Max 08/22", code: "-" },
      { name: "Tresemme", subtitle: "TRES Keratin SM SHMP 6.2 x 960ml-8/22", code: "-" },
      { name: "Glow & Lovely", subtitle: "GAL 25gm Ayur", code: "-" },
    ],
  },
  {
    name: "Tubes",
    products: [
      { name: "Clinic Plus", subtitle: "Clinic Plus Cream 75gm Tube", code: "CPTB075" },
      { name: "Fair & Lovely", subtitle: "F&L Advanced Multi Vitamin 50gm", code: "-" },
    ],
  },
  {
    name: "Sachets",
    products: [
      { name: "Sunsilk", subtitle: "SS Sachet 6ml x 500 Pack", code: "SSSC6ML" },
      { name: "Clinic Plus", subtitle: "CP Sachet 5ml x 500 Pack", code: "-" },
    ],
  },
  {
    name: "Jars",
    products: [{ name: "Glow & Lovely", subtitle: "GAL 50gm Advanced Multivitamin Jar", code: "GAL50JR" }],
  },
  {
    name: "Others",
    products: [{ name: "Custom Product", subtitle: "Manually specified / unlisted SKU", code: "-" }],
  },
];

const CHECKLIST = [
  "Barcode verification",
  "OCR reading",
  "Weight validation",
  "Defect detection",
  "Image processing",
];

type CamTile = {
  label: string;
  meta: string;
  state: "product" | "searching";
  timer: string;
  src?: string;
  angle?: string;
  transformClass?: string;
};

const CAMERAS: CamTile[] = [
  { label: "Cam 1", meta: "1080p · 30fps", state: "product", timer: "00:04:12", src: "/products/dove-front.png", angle: "FRONT" },
  { label: "Cam 2", meta: "1080p · 30fps", state: "searching", timer: "00:04:12" },
  { label: "Cam 3", meta: "1080p · 24fps", state: "product", timer: "00:03:58", src: "/products/dove-back.png", angle: "BACK" },
  {
    label: "Cam 4",
    meta: "720p · 30fps",
    state: "product",
    timer: "00:04:07",
    src: "/products/dove-front.png",
    angle: "SIDE",
    transformClass: "scale-x-[-1] skew-y-[2deg]",
  },
];

function CornerBrackets() {
  const base = "absolute h-4 w-4 border-[var(--text-faint)]/50";
  return (
    <>
      <span className={`${base} left-2 top-2 border-l-2 border-t-2`} />
      <span className={`${base} right-2 top-2 border-r-2 border-t-2`} />
      <span className={`${base} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${base} bottom-2 right-2 border-b-2 border-r-2`} />
    </>
  );
}

function CameraTile({ cam }: { cam: CamTile }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl bg-[#0b0f19] shadow-[var(--shadow-card)]">
      {/* vignette / gradient video-feed background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />

      <div className="relative flex items-center justify-between px-4 pt-3">
        <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
          {cam.label}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">Live</span>
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden py-4">
        <CornerBrackets />
        {cam.state === "product" ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cam.src}
              alt=""
              className={`max-h-[160px] w-auto object-contain opacity-60 grayscale-[35%] contrast-75 ${cam.transformClass ?? ""}`}
            />
            {cam.angle && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-sm">
                {cam.angle}
              </span>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/30">
            <div className="h-16 w-10 rounded-md border border-dashed border-white/25" />
            <span className="text-[10px] uppercase tracking-wider">Searching&hellip;</span>
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-between px-4 pb-3">
        <span className="text-[10px] font-medium text-white/50">{cam.meta}</span>
        <span className="text-[10px] font-medium text-white/30">{cam.timer}</span>
      </div>
    </div>
  );
}

export default function DetectProductStep({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("cameras");
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ManualProduct | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "analyzing") return;

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 4, 100);
        const stepsDone = Math.min(
          CHECKLIST.length,
          Math.floor((next / 100) * CHECKLIST.length) + (next >= 100 ? 0 : 0)
        );
        setCompletedSteps(Math.min(CHECKLIST.length, stepsDone));
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setCompletedSteps(CHECKLIST.length);
          setTimeout(() => onComplete(), 500);
        }
        return next;
      });
    }, 180);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function startAnalyzing() {
    setProgress(0);
    setCompletedSteps(0);
    setPhase("analyzing");
  }

  function stopAnalyzing() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
    setCompletedSteps(0);
    setPhase("idle");
  }

  return (
    <div className="flex h-full min-h-0 flex-col px-8 pb-6 pt-6">
      {phase === "cameras" && (
        <>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-6">
            {CAMERAS.map((cam) => (
              <CameraTile key={cam.label} cam={cam} />
            ))}
          </div>
          <div className="mt-6 flex shrink-0 justify-center">
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="flex items-center gap-2 rounded-lg bg-[var(--accent-blue)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-card)] hover:bg-[#0146d1]"
            >
              <Sparkles className="h-4 w-4" />
              Detect Product
            </button>
          </div>
        </>
      )}

      {phase === "idle" && (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/products/dove-front.png"
              alt="Detected product"
              className="max-h-[70%] w-auto object-contain drop-shadow-md"
            />
            {selectedProduct && (
              <div className="rounded-full bg-[var(--bg-inset)] px-4 py-1.5 text-sm font-medium text-[var(--text-primary)]">
                {selectedProduct.name} <span className="text-[var(--text-muted)]">&middot; {selectedCategory}</span>
              </div>
            )}
          </div>
          <div className="mt-6 flex shrink-0 items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPhase("manual-category")}
              className="rounded-lg bg-[var(--bg-inset)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
            >
              Manual Selection
            </button>
            <button
              type="button"
              onClick={startAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-[var(--accent-blue)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
            >
              <Sparkles className="h-4 w-4" />
              Start Analyzing
            </button>
          </div>
        </>
      )}

      {phase === "manual-category" && (
        <>
          <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-[var(--bg-card)] p-8 shadow-[var(--shadow-card)]">
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Choose Category</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Choose the category to narrow down the product list.
            </p>
            <div className="mt-6 grid flex-1 grid-cols-2 gap-4 md:grid-cols-3 auto-rows-[180px]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setPhase("manual-product");
                  }}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl bg-[var(--bg-inset)] p-6 text-center shadow-[0_0_0_1px_var(--border-subtle)] transition-colors hover:bg-[var(--bg-card-hover)]"
                >
                  <span className="flex h-14 w-14 items-center justify-center">
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cat.image} alt="" className="h-14 w-auto object-contain" />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-card-hover)] text-[var(--text-muted)]">
                        <LayoutGrid className="h-5 w-5" />
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {phase === "manual-product" && (
        <>
          <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-[var(--bg-card)] p-8 shadow-[var(--shadow-card)]">
            <button
              type="button"
              onClick={() => setPhase("manual-category")}
              className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Select Product &middot; <span className="text-[var(--text-muted)]">{selectedCategory}</span>
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Choose the exact product for this session.</p>
            <div className="mt-6 grid flex-1 auto-rows-min grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
              {(CATEGORIES.find((c) => c.name === selectedCategory)?.products ?? []).map((product) => (
                <button
                  key={product.name + product.subtitle}
                  type="button"
                  onClick={() => {
                    setSelectedProduct(product);
                    setPhase("idle");
                  }}
                  className="flex flex-col items-start gap-3 rounded-xl bg-[var(--bg-inset)] p-5 text-left shadow-[0_0_0_1px_var(--border-subtle)] transition-colors hover:bg-[var(--bg-card-hover)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/products/dove-front.png" alt="" className="h-10 w-auto object-contain" />
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{product.name}</div>
                    <div className="mt-0.5 text-xs text-[var(--text-muted)]">{product.subtitle}</div>
                    <div className="mt-1 text-xs text-[var(--text-faint)]">{product.code}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {phase === "analyzing" && (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl bg-[var(--bg-card)] p-10 shadow-[var(--shadow-card)]">
          <div className="flex w-full max-w-3xl items-center justify-center gap-16">
            <div className="flex flex-col items-center">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/products/dove-front.png"
                  alt="Analyzing product"
                  className="h-[260px] w-auto object-contain"
                />
                <div
                  className="absolute left-0 right-0 h-[2px] bg-[var(--accent-blue)] shadow-[0_0_12px_var(--accent-blue)] transition-[top] duration-150 ease-linear"
                  style={{ top: `${progress}%` }}
                />
              </div>
              <div className="mt-4 text-2xl font-bold text-[var(--text-primary)]">{progress}%</div>
            </div>

            <ul className="flex flex-col gap-4">
              {CHECKLIST.map((label, i) => {
                const isChecked = i < completedSteps;
                const isCurrent = i === completedSteps;
                return (
                  <li key={label} className="flex items-center gap-3">
                    {isChecked ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--success)] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <Circle
                        className={`h-5 w-5 ${
                          isCurrent ? "text-[var(--accent-blue)]" : "text-[var(--text-faint)]"
                        }`}
                      />
                    )}
                    <span
                      className={`text-sm ${
                        isChecked || isCurrent
                          ? "font-medium text-[var(--text-primary)]"
                          : "text-[var(--text-faint)]"
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-10 flex shrink-0 flex-col items-center gap-2">
            <p className="text-sm text-[var(--text-muted)]">Please wait while we analyze the product</p>
            <button
              type="button"
              onClick={stopAnalyzing}
              className="text-sm font-medium text-[var(--danger)] hover:underline"
            >
              Stop analyzing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
