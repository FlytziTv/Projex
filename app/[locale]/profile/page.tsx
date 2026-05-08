"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import NavBar, { SidebarProvider } from "@/components/layout/NavBar";
import { InputGroupInput } from "@/components/ui/MyInput";
import { cn } from "@/lib/utils";
import { CLIToken } from "@/types";
import { Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { BlockCard } from "@/components/Profile/BlockCard";
import { BlockTokensGenerator } from "@/components/Profile/BlockTokensGenerator";
import { BlockTokens } from "@/components/Profile/BlockTokens";
import { CardToken } from "@/components/Profile/CardToken";
import { BlockDelete } from "@/components/Profile/BlockDelete";

export default function ProfilePage() {
  const [allTokens, setAllTokens] = useState<CLIToken[]>([]);
  const [userIdCopied, setUserIdCopied] = useState(false);

  const [userid, setUserid] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // 1. La seule fonction de récupération nécessaire
  const fetchTokens = async () => {
    try {
      const jwtToken = localStorage.getItem("projex_token")?.replace(/"/g, "");
      if (!jwtToken) return;

      const response = await fetch(
        "http://localhost:3001/api/auth/cli-tokens",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        // On s'assure d'avoir un tableau pour le .map()
        setAllTokens(Array.isArray(data) ? data : data.tokens || []);
      }
    } catch (err) {
      console.error("Erreur de récupération:", err);
    }
  };

  const handleDeleteToken = (tokenId: string) => {
    setAllTokens((prev) => prev.filter((t) => t.id !== tokenId));
  };

  const handleUpdateProfile = async (field: "name" | "email" | "password") => {
    const value =
      field === "name"
        ? userName
        : field === "email"
          ? userEmail
          : userPassword;
    if (!value) return;

    try {
      const jwtToken = localStorage.getItem("projex_token")?.replace(/"/g, "");
      const response = await fetch("http://localhost:3001/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        alert(`${field} mis à jour avec succès !`);
        if (field === "password") setUserPassword(""); // Reset password field
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwtToken = localStorage
          .getItem("projex_token")
          ?.replace(/"/g, "");
        if (!jwtToken) return;

        const response = await fetch("http://localhost:3001/api/user/me", {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserid(data.id);
          setUserName(data.name || "");
          setUserEmail(data.email || "");
        }
      } catch (err) {
        console.error("Erreur chargement profil:", err);
      }
    };

    fetchUserData();
    fetchTokens();
  }, []);

  const handleCopyUserId = () => {
    setUserIdCopied(true);
    navigator.clipboard.writeText(userid);
    setTimeout(() => setUserIdCopied(false), 2000);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden">
        <SidebarProvider>
          <div className="flex flex-col h-full p-2 shrink-0">
            <NavBar />
          </div>
        </SidebarProvider>

        <main className="flex-1 h-full overflow-y-auto p-4 py-6 gap-6 flex flex-col">
          <div className="flex flex-col gap-8 items-start justify-between w-full px-50">
            {/* Header */}
            <div className="flex flex-col w-full">
              <h1 className="text-2xl font-bold">Mon Profil</h1>
              <p className="text-muted-foreground">
                Gérez vos accès de développeur.
              </p>
            </div>

            {/* Section : Informations */}
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Bloc ID Utilisateur */}
                <BlockCard
                  title="User ID"
                  description="Your unique identifier within the system."
                  message="This ID is used for CLI authentication and project linking."
                >
                  <button
                    onClick={handleCopyUserId}
                    className={cn(
                      "h-9 w-full flex items-center justify-between px-2.5 py-1 rounded-sm border transition-all duration-500",
                      userIdCopied
                        ? "bg-green-500/5 border-green-500/20 text-green-500"
                        : "border-input bg-input/30",
                    )}
                  >
                    <span className="font-mono text-sm">{userid}</span>
                    {userIdCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </BlockCard>

                {/* Bloc Générateur (Ton nouveau composant) */}
                <BlockTokensGenerator onRefreshList={fetchTokens} />

                {/* Liste de tous les tokens */}
                <BlockTokens>
                  <div className="flex flex-col gap-1">
                    {allTokens.length > 0 ? (
                      allTokens.map((t) => (
                        <CardToken
                          key={t.id}
                          id={t.id}
                          label={t.label || t.label}
                          token={t.token_hash || t.token_hash}
                          createdAt={t.createdAt}
                          onDelete={handleDeleteToken}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-border/60 rounded-sm bg-muted/5">
                        <p className="text-xs text-muted-foreground italic">
                          No active tokens found.
                        </p>
                      </div>
                    )}
                  </div>
                </BlockTokens>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-lg font-semibold">Change Information</h2>

              <div className="grid grid-cols-2 gap-4 w-full">
                <BlockCard
                  title="Name"
                  description="Please enter your full name, or a display name you are comfortable with."
                  message="Please use 32 characters at maximum."
                  className="col-span-2"
                  button="save"
                  onclick={() => handleUpdateProfile("name")}
                >
                  <InputGroupInput
                    type="text"
                    placeholder="Enter your new name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    minLength={2}
                    maxLength={32}
                    className="rounded-sm"
                  />
                </BlockCard>
                <BlockCard
                  title="Email"
                  description="Please enter your new email address."
                  message="Please use a valid email address."
                  button="save"
                  onclick={() => handleUpdateProfile("email")}
                >
                  <InputGroupInput
                    type="email"
                    placeholder="Enter your new email address"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    minLength={2}
                    maxLength={32}
                    className="rounded-sm"
                  />
                </BlockCard>
                <BlockCard
                  title="Password"
                  description="Please enter your new password."
                  message="Please use 8-128 characters, and a password secure enough."
                  button="save"
                  onclick={() => handleUpdateProfile("password")}
                >
                  <InputGroupInput
                    type="password"
                    placeholder="Enter your new password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    minLength={8}
                    maxLength={128}
                    className="rounded-sm"
                  />
                </BlockCard>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-lg font-semibold">Red zone</h2>
              <BlockDelete />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
