interface CardProjectProps {
  name: string;
  description: string;
}

export function CardProject({
  currentStatus,
  Project,
}: {
  currentStatus;
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
          className={
            currentStatus.bg +
            " aspect-square w-4 border rounded-full flex items-center justify-center"
          }
        >
          <div
            className={
              currentStatus.led +
              " aspect-square w-1.5 rounded-full animate-pulse "
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatusProject
          value={currentStatus.value || "18"}
          label={currentStatus.label || "Etapes a realiser"}
        />
        <StatusProject
          value={currentStatus.value || "30"}
          label={currentStatus.label || "Etapes realisees"}
        />
      </div>

      <button className="w-full p-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-300 cursor-pointer">
        Voir les details
      </button>
    </div>
  );
}

function StatusProject({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-muted p-3 rounded-sm w-full flex flex-col items-center justify-center">
      <span className="text-base text-foreground font-medium">{value}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
