import { CircleCheck, CircleDashed } from "lucide-react";
import Link from "next/link";

interface CardProjectProps {
  id: string;
  name: string;
  description: string;
  tasks: {
    uncompleted: number;
    completed: number;
  };
}

interface CurrentStatusProps {
  name: string;
  bg: string;
  led: string;
  pulse: boolean;
}

export function CardProject({
  currentStatus,
  Project,
}: {
  currentStatus: CurrentStatusProps;
  Project: CardProjectProps;
}) {
  const total =
    (Project.tasks.completed ?? 0) + (Project.tasks.uncompleted ?? 0);
  const pct =
    total > 0 ? Math.round((Project.tasks.completed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card px-5 py-4 text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
      <div className="flex flex-row items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading text-base font-semibold leading-normal">
            {Project.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {Project.description || "-"}
          </p>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 border border-border rounded-md bg-card text-xs font-medium">
          <div
            className={`${currentStatus.bg} aspect-square w-2.5 rounded-full flex items-center justify-center`}
          >
            <div
              className={`${currentStatus.led} aspect-square w-1.5 rounded-full animate-pulse`}
            />
          </div>
          <span className="text-muted-foreground">{currentStatus.name}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progression</span>
          <span className="font-medium text-foreground">{pct}%</span>
        </div>
        <div className="w-full bg-muted border border-border rounded-full h-2 overflow-hidden">
          <div
            className="bg-sz-1 h-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatsProject value={Project.tasks.completed ?? 0} label="Terminées" />
        <StatsProject
          value={Project.tasks.uncompleted ?? 0}
          label="Restantes"
        />
      </div>

      <Link
        href={`/detail-project/${Project.id}`}
        className="flex w-full items-center justify-center gap-1.5 rounded-md bg-foreground text-background active:scale-98 p-2 text-sm font-medium transition-all duration-200"
      >
        Voir les détails
      </Link>
    </div>
  );
}

interface StatsProjectProps {
  value: number;
  label: "Terminées" | "Restantes";
}

function StatsProject({ value, label }: StatsProjectProps) {
  const Icons = () => {
    if (label === "Terminées") {
      return <CircleCheck size={14} />;
    }
    if (label === "Restantes") {
      return <CircleDashed size={14} />;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted p-3">
      <div className="flex items-center justify-center p-1">{Icons()}</div>
      <div className="flex flex-col gap-0 items-start justify-center">
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
