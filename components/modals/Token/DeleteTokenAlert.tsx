"use client";
import { deleteToken } from "@/lib/api/tokens";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useState } from "react";

type Props = {
  tokenId: string;
  onClose: () => void;
  onSuccess: (tokenId: string) => void;
};

export default function DeleteTokenAlert({
  tokenId,
  onClose,
  onSuccess,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteToken(tokenId);
      onSuccess(tokenId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog.Root open onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover p-4 ring-1 ring-foreground/10">
          <AlertDialog.Title className="font-heading text-base font-medium">
            Supprimer le token ?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer ce token ? Cette action est
            irréversible.
          </AlertDialog.Description>
          {error && (
            <div className="mt-3 p-2 rounded bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="bg-destructive hover:bg-destructive/80 text-white font-medium py-2 px-6 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Suppression..." : "Supprimer"}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
