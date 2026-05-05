"use client";

import { useState } from "react";

export function CliTokenGenerator() {
  const [cliToken, setCliToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");
    setCliToken("");

    try {
      // 1. On récupère le badge de connexion
      const jwtToken = localStorage.getItem("projex_token");

      if (!jwtToken) {
        throw new Error("Vous devez être connecté");
      }

      // 2. On appelle la route backend pour générer le token CLI
      const response = await fetch("http://localhost:3001/api/auth/cli-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération");
      }

      // 3. On stocke le token CLI généré pour l'afficher
      setCliToken(data.cliToken);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cliToken);
    alert("Token copié dans le presse-papier !");
  };

  return (
    <div className="flex flex-col gap-3 p-4 border border-border rounded-lg bg-card text-card-foreground">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">Token d&apos;accès CLI</h3>
        <p className="text-xs text-muted-foreground">
          Générez un jeton pour connecter votre terminal à ce compte Projex.
        </p>
      </div>

      {!cliToken ? (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary text-primary-foreground h-9 px-4 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Génération..." : "Générer un nouveau token"}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="p-2 bg-muted rounded font-mono text-xs break-all border border-border">
            {cliToken}
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-secondary text-secondary-foreground h-8 px-3 text-xs font-medium rounded-md hover:bg-secondary/80 transition-colors"
          >
            Copier le token
          </button>
          <p className="text-[10px] text-destructive">
            Copiez ce token maintenant. Vous ne pourrez plus le revoir ensuite.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
