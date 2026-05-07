"use client";

import { useModalStore } from "@/store/modal.store";

import { Plus } from "lucide-react";

export function AddStepButton({ projectId }: { projectId: string }) {
  const open = useModalStore((s) => s.open);
  return (
    <button
      onClick={() => open({ type: "addStep", projectId })}
      className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors duration-200 cursor-pointer shadow-sm"
    >
      <Plus size={16} />
      Nouvelle étape
    </button>
  );
}
