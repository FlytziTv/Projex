const BASE = "http://localhost:3001/api";

export async function deleteAccount() {
  const token = localStorage.getItem("projex_token");
  const res = await fetch(`${BASE}/user/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur suppression compte");
    }
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
}
