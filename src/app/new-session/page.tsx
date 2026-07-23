"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import StepperHeader from "@/components/new-session/StepperHeader";
import DetectProductStep from "@/components/new-session/DetectProductStep";
import ValidateDetailsStep from "@/components/new-session/ValidateDetailsStep";

type Step = 1 | 2;

export default function NewSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <StepperHeader />
        </div>
        {step === 1 ? (
          <div className="min-h-0 flex-1">
            <DetectProductStep onComplete={() => setStep(2)} />
          </div>
        ) : (
          <div className="min-h-0 flex-1">
            <ValidateDetailsStep onSubmit={() => router.push("/")} />
          </div>
        )}
      </div>
    </div>
  );
}
