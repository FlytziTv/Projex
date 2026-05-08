"use client";

import { Trash, Edit2 } from "lucide-react";
import { useModalStore } from "@/store/modal.store";
import { useRouter } from "next/navigation";

export function CardToken({
  id,
  label,
  token,
  createdAt,
  onDelete,
}: {
  id: string;
  label?: string;
  token: string;
  createdAt: string;
  onDelete?: (id: string) => void;
}) {
  const open = useModalStore((s) => s.open);
  const router = useRouter();
  const maskedToken = token
    ? `${token.substring(0, 6)}••••${token.slice(-4)}`
    : "Invalid Token";

  const handleDelete = () => {
    open({
      type: "deleteToken",
      tokenId: id,
      onSuccess: () => {
        onDelete?.(id);
        router.refresh();
      },
    });
  };

  const handleEdit = () => {
    open({
      type: "editToken",
      tokenId: id,
      label: label || "",
    });
  };

  return (
    <div className="bg-background/60 border border-border/40 flex flex-row items-center justify-between rounded-sm p-3 w-full group">
      <div className="flex flex-row items-center gap-3.5 pl-1">
        <p className="text-sm font-medium text-foreground">
          {label || "CLI Token"}
        </p>
        <hr className="w-px rounded-full h-3.5 bg-border/40 border-none" />
        <p className="text-xs font-mono text-muted-foreground">{maskedToken}</p>
        <hr className="w-px rounded-full h-3.5 bg-border/40 border-none" />
        <p className="text-xs text-muted-foreground/60">
          Created on {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="p-1.5 hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 rounded transition-colors"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded transition-colors"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
}
