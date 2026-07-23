"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import ProductStepper from "@/components/products/ProductStepper";
import ChooseCategoryStep from "@/components/products/ChooseCategoryStep";
import ProductDetailsStep, {
  type BasicInfo,
  type CodingConfig,
  type WeightConfig,
} from "@/components/products/ProductDetailsStep";
import ReviewSaveStep from "@/components/products/ReviewSaveStep";
import ProductSavedStep from "@/components/products/ProductSavedStep";
import type { CategoryName } from "@/components/products/data";

const EMPTY_BASIC_INFO: BasicInfo = { name: "", variant: "", cbuCode: "" };
const EMPTY_WEIGHT: WeightConfig = { nominal: "", min: "", max: "" };
const EMPTY_CODING: CodingConfig = {
  factoryCode: "",
  barcodeFormat: "",
  mrp: "",
  usp: "",
  dateFormat: "",
  bestBefore: "",
};

export default function AddProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);

  const [category, setCategory] = useState<CategoryName | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(EMPTY_BASIC_INFO);
  const [weight, setWeight] = useState<WeightConfig>(EMPTY_WEIGHT);
  const [coding, setCoding] = useState<CodingConfig>(EMPTY_CODING);

  function reset() {
    setStep(1);
    setSaved(false);
    setCategory(null);
    setBasicInfo(EMPTY_BASIC_INFO);
    setWeight(EMPTY_WEIGHT);
    setCoding(EMPTY_CODING);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden px-8 pb-6 pt-6">
        <div className="flex shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <ThemeToggle />
        </div>

        {!saved && (
          <div className="mt-4 shrink-0">
            <ProductStepper current={step} />
          </div>
        )}

        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          {saved ? (
            <ProductSavedStep
              productName={basicInfo.name}
              onAddAnother={reset}
              onGoToProducts={() => router.push("/products")}
            />
          ) : (
            <>
              {step === 1 && (
                <ChooseCategoryStep
                  selected={category}
                  onSelect={(c) => {
                    setCategory(c);
                    setStep(2);
                  }}
                />
              )}
              {step === 2 && (
                <ProductDetailsStep
                  basicInfo={basicInfo}
                  onBasicInfoChange={setBasicInfo}
                  weight={weight}
                  onWeightChange={setWeight}
                  coding={coding}
                  onCodingChange={setCoding}
                />
              )}
              {step === 3 && (
                <ReviewSaveStep category={category} basicInfo={basicInfo} weight={weight} coding={coding} />
              )}

              <div className="mt-4 flex shrink-0 justify-end gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-lg bg-[var(--bg-inset)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                  >
                    Back
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="button"
                    disabled={!basicInfo.name.trim()}
                    onClick={() => setStep(3)}
                    className="rounded-lg bg-[var(--accent-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded-lg bg-[var(--accent-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
                  >
                    Save
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
