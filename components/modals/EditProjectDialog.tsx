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
  onClose: () => void;
};

export function EditProjectDialog({
  projectId,
  name,
  description,
  onClose,
}: Props) {
  const [nameValue, setNameValue] = useState(name);
  const [descValue, setDescValue] = useState(description);
  const router = useRouter();

  const handleSave = async () => {
    await updateProject(projectId, { name: nameValue, description: descValue });
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
