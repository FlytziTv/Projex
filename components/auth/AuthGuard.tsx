"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("projex_token");

      if (!token) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/user/me", {
          headers: { Authorization: `Bearer ${token?.replace(/"/g, "")}` },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("projex_token");
          router.push("/login");
        }
      } catch {
        localStorage.removeItem("projex_token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
