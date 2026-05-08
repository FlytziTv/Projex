"use client";

import { cn } from "@/lib/utils";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useModalStore } from "@/store/modal.store";

export function BlockTokensGenerator({
  onRefreshList,
}: {
  onRefreshList: () => void;
}) {
  const open = useModalStore((s) => s.open);
  const [token, setToken] = useState(""); // Vide par défaut
  const [showToken, setShowToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  const handleCopyToken = () => {
    if (!token) return;
    setTokenCopied(true);
    navigator.clipboard.writeText(token);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleTokenGenerated = (newToken: string) => {
    setToken(newToken);
    onRefreshList();
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

        <button
          onClick={() =>
            open({
              type: "addToken",
              onSuccess: handleTokenGenerated,
            })
          }
          className="text-sm font-medium h-7 px-4 bg-foreground text-background rounded hover:bg-foreground/80 transition-all"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
