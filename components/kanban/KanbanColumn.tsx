import { Step } from "@/types/project";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  title: string;
  steps: Step[];
  active?: boolean;
}

export function KanbanColumn({
  title,
  steps,
  active = false,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          {active && (
            <div className="w-1.5 h-1.5 rounded-full bg-sz-1 animate-pulse" />
          )}
          <h3
            className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}
          >
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-card border border-border px-1.5 py-0.5 rounded">
          {steps.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {steps.length === 0 ? (
          <div className="h-20 border border-dashed border-border rounded-md flex items-center justify-center text-xs text-muted-foreground">
            Vide
          </div>
        ) : (
          steps.map((step) => <KanbanCard key={step.id} step={step} />)
        )}
      </div>
    </div>
  );
}
