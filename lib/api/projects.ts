import { ProjectDetail } from "@/types";

const BASE = "http://localhost:3001/api";

export async function createProject(data: {
  name: string;
  description: string;
  status: string;
}) {
  const token = localStorage.getItem("projex_token");
  const res = await fetch(`${BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur création projet");
    }
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
  const createdProject: ProjectDetail = await res.json();
  return createdProject;
}

export async function updateProject(
  projectId: string,
  data: { name: string; description: string; status: string },
) {
  const res = await fetch(`${BASE}/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur mise à jour projet");
  return res.json();
}

export async function deleteProject(projectId: string) {
  const res = await fetch(`${BASE}/projects/${projectId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur suppression projet");
}
