const BASE = "http://localhost:3001/api";

export async function updateProject(
  projectId: string,
  data: { name: string; description: string },
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
