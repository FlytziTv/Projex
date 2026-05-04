// app/detail-project/[id]/page.tsx
import { notFound } from "next/navigation";
import { SZNav } from "@/components/layout/NavBar";
import { pages } from "@/lib/nav-config";
import Link from "next/link";
import { statusProjects } from "@/lib/status-project";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { ProjectDetail, StepStatus, Step } from "@/types/project";
import { Ellipsis, FileCodeCorner, Plus, Terminal } from "lucide-react";

interface DetailProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Simulation d'API (à remplacer plus tard par ton fetch vers Express)
async function getProjectById(id: string): Promise<ProjectDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (id === "1") {
    return {
      id: "1",
      name: "LogPulse",
      description: "Agrégateur de logs en temps réel auto-hébergé.",
      status: "active",
      created_at: "2026-04-10T10:00:00Z",
      steps: [
        {
          id: "s1",
          project_id: "1",
          number: 1,
          title: "Initialisation repo",
          status: "done",
          note: "Utilisation de npm workspaces",
          updated_at: "2026-04-10T10:30:00Z",
        },
        {
          id: "s2",
          project_id: "1",
          number: 2,
          title: "Création de la BDD",
          status: "in_progress",
          note: null,
          updated_at: "2026-04-11T09:00:00Z",
        },
        {
          id: "s4",
          project_id: "1",
          number: 4,
          title: "Maquette UI",
          status: "skipped",
          note: "Fait directement en code",
          updated_at: "2026-04-10T10:00:00Z",
        },
        {
          id: "s3",
          project_id: "1",
          number: 3,
          title: "Route API pour les logs",
          status: "todo",
          note: "Ne pas oublier Zod pour valider l'entrée",
          updated_at: "2026-04-10T10:00:00Z",
        },
        {
          id: "s5",
          project_id: "1",
          number: 5,
          title: "Dashboard Front",
          status: "todo",
          note: null,
          updated_at: "2026-04-10T10:00:00Z",
        },
      ],
    };
  }
  return null;
}

export default async function DetailProjectPage({
  params,
}: DetailProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const completedSteps = project.steps.filter(
    (s) => s.status === "done" || s.status === "skipped",
  ).length;
  const totalSteps = project.steps.length;
  const progressPercentage =
    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);
  const currentStatusStyle = statusProjects[project.status];

  const sortedSteps = [...project.steps].sort((a, b) => a.number - b.number);
  const stepsByStatus: Record<StepStatus, Step[]> = {
    todo: sortedSteps.filter((s) => s.status === "todo"),
    in_progress: sortedSteps.filter((s) => s.status === "in_progress"),
    done: sortedSteps.filter((s) => s.status === "done"),
    skipped: sortedSteps.filter((s) => s.status === "skipped"),
  };

  return (
    <div className="flex flex-col flex-1 bg-background font-sans text-foreground min-h-screen pb-12">
      <SZNav top={false} NavPages={pages} />

      <main className="flex flex-col gap-10 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
        {/* header */}
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit flex items-center gap-2"
          >
            &larr; Retour
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 px-2.5 py-1 border border-border rounded-md bg-card text-xs font-medium">
                  <div
                    className={`${currentStatusStyle.bg} aspect-square w-2.5 rounded-full flex items-center justify-center`}
                  >
                    <div
                      className={`${currentStatusStyle.led} aspect-square w-1.5 rounded-full animate-pulse`}
                    />
                  </div>
                  <span className="text-muted-foreground">
                    {currentStatusStyle.name}
                  </span>
                </div>
              </div>
              <p className="text-base text-muted-foreground">
                {project.description}
              </p>
            </div>

            {/* BARRE D'ACTIONS DU PROJET */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
              {/* Bouton Primaire : Ajouter une étape */}
              <button className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors duration-200 cursor-pointer shadow-sm">
                <Plus size={16} />
                Nouvelle étape
              </button>

              {/* Bouton Secondaire : Copier l'ID */}
              <button
                className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 cursor-pointer shadow-sm"
                title="Copier l'ID du projet pour le CLI"
              >
                <Terminal size={16} />
                ID
              </button>

              {/* Ligne séparatrice discrète */}
              <div className="w-px h-5 bg-border mx-1"></div>

              {/* Bouton Documentation */}
              <button
                className="flex items-center justify-center bg-transparent hover:bg-muted/50 border border-transparent w-8 h-8 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                title="Documentation CLI"
              >
                <FileCodeCorner size={16} />
              </button>

              {/* Bouton Plus d'options (3 points) */}
              <button
                className="flex items-center justify-center bg-card border border-border w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200 cursor-pointer shadow-sm"
                title="Paramètres du projet"
              >
                <Ellipsis size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ProgressBar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Progression ({completedSteps}/{totalSteps})
            </span>
            <span className="font-mono">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-card border border-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-sz-1 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* kanban dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          <KanbanColumn title="À faire" steps={stepsByStatus.todo} />
          <KanbanColumn
            title="En cours"
            steps={stepsByStatus.in_progress}
            active
          />
          <KanbanColumn title="Terminé" steps={stepsByStatus.done} />
          <KanbanColumn title="Ignoré" steps={stepsByStatus.skipped} />
        </div>
      </main>
    </div>
  );
}
