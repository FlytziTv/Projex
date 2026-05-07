const BASE = "http://localhost:3001/api";

export async function updateStep(
  projectId: string,
  stepNumber: number,
  data: { title: string; note: string; status: string },
) {
  const token = localStorage.getItem("projex_token");

  const res = await fetch(`${BASE}/projects/${projectId}/steps/${stepNumber}`, {
    method: "PATCH",
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
      throw new Error(errorData.error || "Erreur mise à jour étape");
    }
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
}

export async function deleteStep(stepId: string) {
  const token = localStorage.getItem("projex_token");
  const res = await fetch(`${BASE}/steps/${stepId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur suppression étape");
    }
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
}
