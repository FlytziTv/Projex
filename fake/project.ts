interface ProjectProps {
  id: number;
  status: "online" | "pause" | "offline" | "idle";
  name: string;
  description: string;
  tasks: {
    uncompleted: number;
    completed: number;
  };
}

export const metadataProjects: ProjectProps[] = [
  {
    id: 1,
    status: "online",
    name: "Project 1",
    description: "Project description",
    tasks: {
      uncompleted: 19,
      completed: 23,
    },
  },
  {
    id: 2,
    status: "pause",
    name: "Project 2",
    description: "Project description",
    tasks: {
      uncompleted: 5,
      completed: 10,
    },
  },
  {
    id: 3,
    status: "offline",
    name: "Project 3",
    description: "Project description",
    tasks: {
      uncompleted: 0,
      completed: 15,
    },
  },
  {
    id: 4,
    status: "idle",
    name: "Project 4",
    description: "Project description",
    tasks: {
      uncompleted: 10,
      completed: 0,
    },
  },
];
