"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProject } from "@/lib/api/projects";
import {
  InputGroup,
  InputGroupInput,
  InputGroupLabel,
  InputGroupTextarea,
} from "../ui/MyInput";

type Props = {
  projectId: string;
  name: string;
  description: string;
  status: string;
  onClose: () => void;
};

export function EditProjectDialog({
  projectId,
  name,
  description,
  status,
  onClose,
}: Props) {
  const [nameValue, setNameValue] = useState(name);
  const [descValue, setDescValue] = useState(description);
  const [statusValue, setStatusValue] = useState(status);
  const router = useRouter();

  const handleSave = async () => {
    await updateProject(projectId, {
      name: nameValue,
      description: descValue,
      status: statusValue,
    });
    onClose();
    router.refresh();
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 isolate z-50 bg-black/10 backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <Dialog.Title className="font-heading text-base leading-none font-medium">
            Modifier le projet
          </Dialog.Title>

          <div className="flex flex-col gap-4">
            <InputGroup>
              <InputGroupLabel>Nom du projet</InputGroupLabel>
              <InputGroupInput
                type="text"
                placeholder="Ex: Configuration Prisma..."
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <InputGroupLabel>Description</InputGroupLabel>
              <InputGroupTextarea
                placeholder="Ex: Description du projet..."
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <InputGroupLabel>Status</InputGroupLabel>
              <select
                value={statusValue}
                onChange={(e) =>
                  setStatusValue(
                    e.target.value as
                      | "active"
                      | "paused"
                      | "completed"
                      | "abandoned"
                      | "future",
                  )
                }
                className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
              >
                <option className="text-background" value="active">
                  Actif (Active)
                </option>
                <option className="text-background" value="paused">
                  En pause (Paused)
                </option>
                <option className="text-background" value="completed">
                  Terminé (Completed)
                </option>
                <option className="text-background" value="abandoned">
                  Abandonné (Abandoned)
                </option>
                <option className="text-background" value="future">
                  À venir (Future)
                </option>
              </select>
            </InputGroup>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={onClose}
                className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-foreground hover:bg-foreground/80 border text-background font-medium py-2 px-6 rounded-md transition-colors cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
