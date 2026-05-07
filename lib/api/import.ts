const BASE = "http://localhost:3001/api";

export async function importSteps(projectId: string, steps: unknown[]) {
  const token = localStorage.getItem("projex_token");

  const res = await fetch(`${BASE}/projects/${projectId}/import-steps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ steps }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || res.statusText);
  }
}
