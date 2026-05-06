"use client";

import TokenGenerator from "@/components/actions/TokenGenerator";
import { AuthGuard } from "@/components/auth/AuthGuard";
import NavBar, { SidebarProvider } from "@/components/layout/NavBar";
import { InputGroupInput } from "@/components/ui/MyInput";
import { cn } from "@/lib/utils";
import { CLIToken } from "@/types";
import { Copy, Check, Trash, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [allTokens, setAllTokens] = useState<CLIToken[]>([]);
  const [userid] = useState("1234567890abcdefake");
  const [userIdCopied, setUserIdCopied] = useState(false);

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

  useEffect(() => {
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
                          label={t.label || t.label}
                          token={t.token_hash || t.token_hash}
                          createdAt={t.createdAt}
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
                >
                  <InputGroupInput
                    type="text"
                    placeholder="Enter your new name"
                    // value={}
                    // onChange={() => {}}
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
                >
                  <InputGroupInput
                    type="email"
                    placeholder="Enter your new email address"
                    // value={}
                    // onChange={() => {}}
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
                >
                  <InputGroupInput
                    type="password"
                    placeholder="Enter your new password"
                    // value={}
                    // onChange={() => {}}
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

function BlockCard({
  title,
  description,
  message,
  children,
  button,
  onclick,
  className,
}: {
  title: string;
  description: string;
  message: string;
  children: React.ReactNode;
  button?: string;
  onclick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border/40 rounded-sm w-full flex flex-col",
        className,
      )}
    >
      <div className="bg-muted/20 p-4 flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
      <div className="flex flex-row items-center justify-between p-3 border-t border-border/40 ">
        <p className="pl-1 text-sm text-muted-foreground h-7 content-center">
          {message}
        </p>
        {button && (
          <button
            onClick={onclick}
            className="text-sm font-medium h-7 px-4 bg-foreground text-background hover:bg-foreground/80 active:scale-95 rounded transition-all duration-200"
          >
            {button}
          </button>
        )}
      </div>
    </div>
  );
}

function BlockTokens({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border border-border/40 rounded-sm w-full col-span-2">
      <div className="bg-muted/20 p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">All Tokens Generated</h4>
          <p className="text-sm text-muted-foreground">
            Here you can see all the tokens you have generated, and revoke them
            if needed.
          </p>
        </div>
        {children}
      </div>
      <div className="flex flex-row items-center justify-end p-3 border-t border-border/40">
        <button className="text-sm font-medium h-7 px-3 bg-destructive text-foreground hover:bg-destructive/80 active:scale-95 rounded transition-all duration-200">
          Delete All Tokens
        </button>
      </div>
    </div>
  );
}

function BlockDelete() {
  return (
    <div className="border border-destructive/40 rounded-sm w-full">
      <div className="bg-muted/20 p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Delete Account</h4>
          <p className="text-sm text-muted-foreground">
            This action is irreversible. All your data will be permanently
            deleted, including your projects, tasks, and account information.
            Please make sure to back up any important data before proceeding. If
            you are sure about this action, click the button below to delete
            your account.
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end p-3 bg-destructive/10 border-t border-destructive/20">
        <button className="text-sm font-medium h-7 px-3 bg-destructive text-foreground hover:bg-destructive/80 active:scale-95 rounded transition-all duration-200">
          Delete Personal Account
        </button>
      </div>
    </div>
  );
}

function CardToken({
  label,
  token,
  createdAt,
}: {
  label?: string;
  token: string;
  createdAt: string;
}) {
  const maskedToken = token
    ? `${token.substring(0, 6)}••••${token.slice(-4)}`
    : "Invalid Token";

  return (
    <div className="bg-background/60 border border-border/40 flex flex-row items-center justify-between rounded-sm p-3 w-full group">
      <div className="flex flex-row items-center gap-3.5 pl-1">
        <p className="text-sm font-medium text-foreground">
          {label || "CLI Token"}
        </p>
        <hr className="w-px rounded-full h-3.5 bg-border/40 border-none" />
        {/* On affiche la version masquée */}
        <p className="text-xs font-mono text-muted-foreground">{maskedToken}</p>
        <hr className="w-px rounded-full h-3.5 bg-border/40 border-none" />
        <p className="text-xs text-muted-foreground/60">
          Created on {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* On ne peut pas le copier, on peut juste le supprimer pour en refaire un nouveau */}
      <button className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded transition-colors">
        <Trash size={14} />
      </button>
    </div>
  );
}

function BlockTokensGenerator({
  onRefreshList, // Ajoute cette prop pour rafraîchir la liste en bas
}: {
  onRefreshList: () => void;
}) {
  const [token, setToken] = useState(""); // Vide par défaut
  const [showToken, setShowToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCopyToken = () => {
    if (!token) return;
    setTokenCopied(true);
    navigator.clipboard.writeText(token);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  return (
    <div className="border border-border/40 rounded-sm w-full flex flex-col">
      <div className="bg-muted/20 p-4 flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Token CLI</h4>
          <p className="text-sm text-muted-foreground">
            This is your unique token to access your account via the CLI. It
            will only be shown once.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 w-full">
            <button
              onClick={handleCopyToken}
              className={cn(
                "h-9 flex-1 flex items-center justify-between px-2.5 py-1 rounded-sm border transition-all duration-500",
                tokenCopied
                  ? "bg-green-500/5 border-green-500/20 text-green-500"
                  : "border-input bg-input/30",
              )}
            >
              <span className="font-mono text-xs">
                {token
                  ? showToken
                    ? token
                    : "px_••••••••••••••••"
                  : "No token generated"}
              </span>
              {tokenCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button
              onClick={() => setShowToken(!showToken)}
              className="h-9 px-3 border border-input bg-input/30 hover:bg-input/50 rounded-sm transition-colors"
            >
              {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {token && (
            <p className="text-[10px] text-destructive italic">
              Warning: Copy this token now. It won&apos;t be shown again.
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between p-3 border-t border-border/40 ">
        <p className="pl-1 text-sm text-muted-foreground h-7 content-center">
          This token is used for CLI authentication
        </p>

        {/* Ton composant Dialog externe */}
        <TokenGenerator
          onTokenGenerated={(newToken) => setToken(newToken)}
          onSuccess={onRefreshList} // On appelle la prop ici
        >
          <button className="text-sm font-medium h-7 px-4 bg-foreground text-background rounded hover:bg-foreground/80 transition-all">
            Generate
          </button>
        </TokenGenerator>
      </div>
    </div>
  );
}
