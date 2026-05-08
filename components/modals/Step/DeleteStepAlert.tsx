"use client";
import { deleteStep } from "@/lib/api/tasks";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";

type Props = { stepId: string; onClose: () => void };

export function DeleteStepAlert({ stepId, onClose }: Props) {
  const router = useRouter();

  const handleConfirm = async () => {
    await deleteStep(stepId);
    onClose();
    router.refresh();
  };

  return (
    <AlertDialog.Root open onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover p-4 ring-1 ring-foreground/10">
          <AlertDialog.Title className="font-heading text-base font-medium">
            Supprimer l&apos;étape ?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer cette étape ? Cette action est
            irréversible.
          </AlertDialog.Description>
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onClose}
                className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleConfirm}
                className="bg-destructive hover:bg-destructive/80 text-white font-medium py-2 px-6 rounded-md transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
