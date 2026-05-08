import { ProjectStatus } from "@/lib/status-project";
import { AuthGuard } from "@/components/auth/AuthGuard";
import NavBar, { SidebarProvider } from "@/components/layout/NavBar";
import { ProjectsClient } from "@/components/projects/ProjectsClient";

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: {
    uncompleted: number;
    completed: number;
  };
}

async function getProjects(): Promise<ProjectSummary[]> {
  try {
    const response = await fetch("http://localhost:3001/api/projects", {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Erreur de récupération");

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden">
        <SidebarProvider>
          <div className="flex flex-col h-full p-2 shrink-0">
            <NavBar />
          </div>
        </SidebarProvider>
        <ProjectsClient projects={projects} />
      </div>
    </AuthGuard>
  );
}
