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
        <AlertDialog.Overlay className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-5 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-[525px] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <AlertDialog.Title className="font-heading text-base leading-none font-medium">
            Supprimer le projet ?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground">
            Cette action est irréversible. Le projet et toutes ses étapes seront
            supprimés.
          </AlertDialog.Description>
          <div className="flex flex-row items-center justify-end gap-4 mt-1">
            <AlertDialog.Cancel asChild>
              <button className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer">
                Annuler
              </button>
            </AlertDialog.Cancel>
            <button
              onClick={handleConfirm}
              className="bg-destructive/80 hover:bg-destructive/50 text-foreground font-medium py-2 px-6 rounded-md transition-colors disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:opacity-50 duration-200 cursor-pointer"
            >
              Supprimer
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
