export type ProjectStatus =
  | "active"
  | "paused"
  | "completed"
  | "abandoned"
  | "future";

export const statusProjects: Record<
  ProjectStatus,
  { name: string; value: string; bg: string; led: string; pulse: boolean }
> = {
  active: {
    name: "Actif",
    value: "active",
    bg: "bg-green-500/20 border-green-500/20",
    led: "bg-green-500",
    pulse: true,
  },
  paused: {
    name: "En pause",
    value: "paused",
    bg: "bg-yellow-500/20 border-yellow-500/20",
    led: "bg-yellow-500",
    pulse: false,
  },
  completed: {
    name: "Terminé",
    value: "completed",
    bg: "bg-blue-500/20 border-blue-500/20",
    led: "bg-blue-500",
    pulse: false,
  },
  abandoned: {
    name: "Abandonné",
    value: "abandoned",
    bg: "bg-red-500/20 border-red-500/20",
    led: "bg-red-500",
    pulse: false,
  },
  future: {
    name: "À venir",
    value: "future",
    bg: "bg-gray-500/20 border-gray-500/20",
    led: "bg-gray-500",
    pulse: false,
  },
};
