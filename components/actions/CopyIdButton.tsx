"use client";

import { useState } from "react";
import { Terminal, Check } from "lucide-react";

interface CopyIdButtonProps {
  projectId: string;
}

export function CopyIdButton({ projectId }: CopyIdButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(projectId);
    setCopied(true);

    // Remet le bouton dans son état normal après 2s
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-500 cursor-pointer shadow-sm border ${
        copied
          ? "bg-green-500/10 border-green-500/20 text-green-500"
          : "bg-card border-border text-foreground hover:bg-muted/80"
      }`}
      title="Copier l'ID du projet pour le CLI"
    >
      {copied ? <Check size={16} /> : <Terminal size={16} />}
      {copied ? "Copié" : "ID"}
    </button>
  );
}
