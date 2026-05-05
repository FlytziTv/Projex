import { CardProject } from "@/components/card/CardProject";
import { SZNav } from "@/components/layout/NavBar";
import { pages } from "@/lib/nav-config";
import { statusProjects, ProjectStatus } from "@/lib/status-project";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { CliTokenGenerator } from "@/components/auth/CliTokenGenerator";

interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: {
    uncompleted: number;
    completed: number;
  };
}

// Fonction pour fetcher l'API
async function getProjects(): Promise<ProjectSummary[]> {
  try {
    const response = await fetch("http://localhost:3001/api/projects", {
      cache: "no-store", // Pas de cache en dev
    });

    if (!response.ok) throw new Error("Erreur de récupération");

    return await response.json();
  } catch (error) {
    console.error(error);
    return []; // En cas d'erreur (si le backend est éteint), on renvoie un tableau vide
  }
}

export default async function Home() {
  const projects = await getProjects();
  return (
    <AuthGuard>
      <div className="flex flex-col flex-1 bg-background font-sans text-foreground">
        <SZNav top={false} NavPages={pages} />

        {/* <CliTokenGenerator /> */}

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Vos Projects</h1>
            <p className="text-muted-foreground">
              Gérez vos projets et étapes directement depuis votre terminal.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="w-full p-8 border border-dashed rounded-lg text-center text-muted-foreground">
              Aucun projet trouvé. Créez-en un depuis le terminal ou la BDD.
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projects.map((project) => (
                <CardProject
                  key={project.id}
                  currentStatus={statusProjects[project.status]}
                  Project={project}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
