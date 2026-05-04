import { ProjectStatus } from "@/lib/status-project";

// Optionnel mais recommandé : typer ton mock de données
export interface FakeProject {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus; // <-- C'est ici que la magie opère
  tasks: {
    uncompleted: number;
    completed: number;
  };
}

export const metadataProjects: FakeProject[] = [
  {
    id: 1,
    name: "LogPulse",
    description: "Agrégateur de logs en temps réel auto-hébergé.",
    status: "active",
    tasks: {
      uncompleted: 1,
      completed: 2,
    },
  },
  {
    id: 2,
    name: "Ancien Projet",
    description: "Un vieux projet test.",
    status: "abandoned",
    tasks: {
      uncompleted: 5,
      completed: 0,
    },
  },
  {
    id: 3,
    name: "Projet en attente",
    description: "En attente de validation client.",
    status: "paused",
    tasks: {
      uncompleted: 10,
      completed: 5,
    },
  },
];
