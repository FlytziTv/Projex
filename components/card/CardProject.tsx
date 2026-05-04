import Link from "next/link";

interface CardProjectProps {
  id: number;
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
}

export function CardProject({
  currentStatus,
  Project,
}: {
  currentStatus: CurrentStatusProps;
  Project: CardProjectProps;
}) {
  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-xl bg-card px-5 py-4 text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-0 items-start">
          <h2 className="font-heading text-base leading-normal font-semibold">
            {Project.name}
          </h2>
          <p className="text-sm text-muted-foreground">{Project.description}</p>
        </div>

        <div
          className={`${currentStatus.bg} aspect-square w-4 border rounded-full flex items-center justify-center`}
        >
          <div
            className={`${currentStatus.led} aspect-square w-1.5 rounded-full animate-pulse `}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TasksProject
          value={Project.tasks.uncompleted ?? "-"}
          label="Etapes a realiser"
        />
        <TasksProject
          value={Project.tasks.completed ?? "-"}
          label="Etapes realisees"
        />
      </div>

      <Link
        href={`/detail-project/${Project.id}`}
        className="w-full p-2 rounded-md bg-primary text-center text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-300 cursor-pointer"
      >
        Voir les details
      </Link>
    </div>
  );
}

function TasksProject({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="bg-muted p-3 rounded-sm w-full flex flex-col items-center justify-center">
      <span className="text-base text-foreground font-medium">{value}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
