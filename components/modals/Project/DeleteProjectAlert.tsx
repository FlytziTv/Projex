"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/lib/api/projects";

type Props = { projectId: string; onClose: () => void };

export function DeleteProjectAlert({ projectId, onClose }: Props) {
  const router = useRouter();

  const handleConfirm = async () => {
    await deleteProject(projectId);
    onClose();
    router.push("/");
  };

  return (
    <AlertDialog.Root open onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover p-4 ring-1 ring-foreground/10">
          <AlertDialog.Title className="font-heading text-base font-medium">
            Supprimer le projet ?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            Cette action est irréversible. Le projet et toutes ses étapes seront
            supprimés.
          </AlertDialog.Description>
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialog.Cancel asChild>
              <button className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors cursor-pointer">
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
