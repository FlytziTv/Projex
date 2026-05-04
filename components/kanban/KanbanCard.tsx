import { Step } from "@/types/project";

interface KanbanCardProps {
  step: Step;
}

export function KanbanCard({ step }: KanbanCardProps) {
  return (
    <div className="group bg-card border border-border rounded-md p-3 hover:border-sz-1/50 transition-colors flex flex-col gap-2">
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
    </div>
  );
}
