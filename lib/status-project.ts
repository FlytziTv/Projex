export type ProjectStatus =
  | "active"
  | "paused"
  | "completed"
  | "abandoned"
  | "future";

export const statusProjects: Record<
  ProjectStatus,
  { name: string; bg: string; led: string }
> = {
  active: {
    name: "Actif",
    bg: "bg-green-500/20 border-green-500/20",
    led: "bg-green-500",
  },
  paused: {
    name: "En pause",
    bg: "bg-yellow-500/20 border-yellow-500/20",
    led: "bg-yellow-500",
  },
  completed: {
    name: "Terminé",
    bg: "bg-blue-500/20 border-blue-500/20",
    led: "bg-blue-500",
  },
  abandoned: {
    name: "Abandonné",
    bg: "bg-red-500/20 border-red-500/20",
    led: "bg-red-500",
  },
  future: {
    name: "À venir",
    bg: "bg-gray-500/20 border-gray-500/20",
    led: "bg-gray-500",
  },
};
