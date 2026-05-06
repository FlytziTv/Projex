"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { InputGroup, InputGroupInput, InputGroupLabel } from "../ui/MyInput";

interface TokenGeneratorProps {
  children: React.ReactNode;
  onTokenGenerated: (newToken: string) => void; // Pour mettre à jour l'affichage du token en clair
  onSuccess: () => void; // Pour rafraîchir la liste "All Tokens"
}

export default function TokenGenerator({
  children,
  onTokenGenerated,
  onSuccess,
}: TokenGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirmGenerateToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Empêche le rechargement de la page
    if (!newTokenName.trim()) return;

    setIsLoading(true);
    try {
      const jwtToken = localStorage.getItem("projex_token")?.replace(/"/g, "");

      const response = await fetch("http://localhost:3001/api/auth/cli-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ label: newTokenName }), // Vérifie si ton back attend 'label' ou 'name'
      });

      const data = await response.json();
      if (response.ok) {
        onTokenGenerated(data.cliToken); // Met à jour le token affiché sur la page profil
        onSuccess(); // Rafraîchit la liste des tokens
        setIsOpen(false); // Ferme la modal
        setNewTokenName(""); // Reset le champ
      }
    } catch (err) {
      console.error("Erreur génération:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-card p-6 shadow-xl border border-border animate-in zoom-in-95 duration-200 outline-none">
          <Dialog.Title className="text-lg font-semibold leading-none mb-2">
            Generate New Token
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mb-6">
            Give a name to your token to identify it later (ex: &quot;Work
            Laptop&quot;).
          </Dialog.Description>

          <form onSubmit={confirmGenerateToken} className="flex flex-col gap-6">
            <InputGroup>
              <InputGroupLabel>Token Name</InputGroupLabel>
              <InputGroupInput
                autoFocus
                type="text"
                placeholder="Ex: MacBook Pro..."
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
              />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isLoading || !newTokenName.trim()}
                className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isLoading ? "Generating..." : "Generate Token"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
