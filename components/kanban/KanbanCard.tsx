"use client";

import { Step } from "@/types/project";
import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Pen, Trash2 } from "lucide-react";
import { useModalStore } from "@/store/modal.store";

interface KanbanCardProps {
  step: Step;
}

export function KanbanCard({ step }: KanbanCardProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const open = useModalStore((s) => s.open);

  return (
    <AlertDialog.Root
      open={openDeleteDialog}
      onOpenChange={setOpenDeleteDialog}
    >
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

        <div className="absolute right-3 top-3 flex flex-row items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() =>
              open({
                type: "editStep",
                projectId: step.project_id,
                stepNumber: step.number,
                title: step.title,
                note: step.note,
                status: step.status,
              })
            }
            className="flex items-center justify-center bg-transparent hover:bg-muted/50 border border-transparent w-8 h-8 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
            title="Edit step"
          >
            <Pen size={14} />
          </button>

          <button
            onClick={() => open({ type: "deleteStep", stepId: step.id })}
            className="flex items-center justify-center bg-transparent hover:bg-destructive/20 border border-transparent w-8 h-8 rounded-md text-muted-foreground hover:text-destructive transition-colors duration-200 cursor-pointer"
            title="Supprimer l'étape"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </AlertDialog.Root>
  );
}
