const BASE = "http://localhost:3001/api";

export async function createToken(label: string) {
  const token = localStorage.getItem("projex_token");
  const res = await fetch(`${BASE}/auth/cli-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ label }),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur création token");
    }
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function updateToken(tokenId: string, label: string) {
  const token = localStorage.getItem("projex_token");
  const res = await fetch(`${BASE}/auth/cli-token/${tokenId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ label }),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur modification token");
    }
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteToken(tokenId: string) {
  const token = localStorage.getItem("projex_token");
  const res = await fetch(`${BASE}/auth/cli-token/${tokenId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur suppression token");
    }
    throw new Error(`Erreur ${res.status}: ${res.statusText}`);
  }
}
