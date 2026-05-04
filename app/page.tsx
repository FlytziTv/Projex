import { CardProject } from "@/components/card/CardProject";
import { SZNav } from "@/components/layout/NavBar";
import { metadataProjects } from "@/fake/project";
import { pages } from "@/lib/nav-config";
import { statusProjects } from "@/lib/status-project";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background font-sans text-foreground">
      <SZNav top={false} NavPages={pages} />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Vos Projects</h1>
          <p className="text-muted-foreground">
            Gérez vos projets et étapes directement depuis votre terminal.
          </p>
        </div>

        <div className="w-full grid grid-cols-4 gap-4">
          {metadataProjects.map((project) => (
            <CardProject
              key={project.id}
              currentStatus={statusProjects[project.status]}
              Project={project}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
