export type ProjectStatus =
  | "active"
  | "paused"
  | "completed"
  | "abandoned"
  | "future";
export type StepStatus = "todo" | "in_progress" | "done" | "skipped";

export interface Step {
  id: string;
  project_id: string;
  number: number;
  title: string;
  status: StepStatus;
  note: string | null;
  updated_at: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  created_at: string;
  steps: Step[];
}

export type CLIToken = {
  id: string;
  label?: string;
  token_hash: string;
  createdAt: string;
};
