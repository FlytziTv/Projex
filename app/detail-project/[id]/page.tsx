import { notFound } from "next/navigation";
import Link from "next/link";
import { statusProjects } from "@/lib/status-project";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { ProjectDetail, StepStatus, Step } from "@/types/project";
import { ArrowLeft } from "lucide-react";
import NavBar, { SidebarProvider } from "@/components/layout/NavBar";
import { CopyIdButton } from "@/components/actions/CopyIdButton";
import DocsButton from "@/components/actions/DocsButton";
import { AddStepButton } from "@/components/actions/AddStepButton";
import StepImporter from "@/components/modals/Step/ImportFileDialog";
import ProjectSettings from "@/components/actions/ProjectSettings";

interface DetailProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProjectById(id: string): Promise<ProjectDetail | null> {
  try {
    // On appelle ton API locale (assure-toi que le port est bien le 3001)
    const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
      // On empêche Next.js de mettre la réponse en cache pour voir les modifications en direct
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data: ProjectDetail = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    return null;
  }
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
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarProvider>
        <div className="flex flex-col h-full p-2 shrink-0">
          <NavBar />
        </div>
      </SidebarProvider>
      <main className="flex-1 h-full overflow-y-auto p-4 py-6 gap-6 flex flex-col">
        {/* header */}
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Retour
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
              <AddStepButton projectId={project.id} />

              <StepImporter projectId={project.id} />

              {/* Bouton Secondaire : Copier l'ID */}
              <CopyIdButton projectId={project.id} />

              {/* Ligne séparatrice discrète */}
              <div className="w-px h-5 bg-border mx-1"></div>

              {/* Bouton Documentation */}
              <DocsButton />

              {/* Bouton Plus d'options (3 points) */}
              <ProjectSettings project={project} />
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
