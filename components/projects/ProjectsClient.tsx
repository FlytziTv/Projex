"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CardProject } from "@/components/card/CardProject";
import { statusProjects } from "@/lib/status-project";
import { CreateProjectForm } from "@/components/projects/CreateProjectForm";
import { DialogContent } from "../layout/RootContent";
import { ProjectSummary } from "@/app/page";
import { Plus } from "lucide-react";

export function ProjectsClient({ projects }: { projects: ProjectSummary[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <main className="flex-1 h-full overflow-y-auto p-4 py-6 gap-6 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Your Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and tasks directly from your terminal.
            </p>
          </div>

          <Dialog.Trigger asChild>
            <button className="flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/80 text-background font-medium h-8 px-3.5 rounded-md transition-colors duration-200 cursor-pointer text-sm">
              <Plus size={16} /> New Project
            </button>
          </Dialog.Trigger>
        </div>

        <DialogContent title="Create New Project">
          <CreateProjectForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>

        {projects.length === 0 ? (
          <div className="w-full p-8 border border-dashed rounded-lg text-center text-muted-foreground">
            No projects found. Create one from the terminal or the database.
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
      </main>
    </Dialog.Root>
  );
}
