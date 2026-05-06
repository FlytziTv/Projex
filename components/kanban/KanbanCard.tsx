"use client";

import { Step } from "@/types/project";
import { EditStepForm } from "../actions/EditStepButton";
import { useRouter } from "next/navigation"; // L'astuce Next.js

interface KanbanCardProps {
  step: Step;
}

export function KanbanCard({ step }: KanbanCardProps) {
  const router = useRouter();

  const handleStepUpdated = () => {
    router.refresh();
  };

  return (
    <div className="group bg-card border border-border rounded-md p-3 hover:border-sz-1/50 transition-colors flex flex-col gap-2 relative">
      <div className="flex justify-between items-start gap-2">
        <span className="text-[10px] font-mono text-muted-foreground">
          STP-{step.number}
        </span>
      </div>
      <p className="font-medium text-sm text-foreground">{step.title}</p>

      {step.note && (
        <p className="text-xs text-muted-foreground border-l-2 border-border pl-2 mt-1">
          {step.note}
        </p>
      )}

      <div
        style={{ position: "absolute", right: "12px", top: "12px" }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <EditStepForm step={step} onStepUpdated={handleStepUpdated} />
      </div>
    </div>
  );
}
