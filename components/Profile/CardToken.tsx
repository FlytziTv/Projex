import { Trash } from "lucide-react";

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
  onDelete: (id: string) => void;
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
        <p className="text-xs font-mono text-muted-foreground">{maskedToken}</p>
        <hr className="w-px rounded-full h-3.5 bg-border/40 border-none" />
        <p className="text-xs text-muted-foreground/60">
          Created on {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={() => onDelete(id)}
        className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded transition-colors"
      >
        <Trash size={14} />
      </button>
    </div>
  );
}
