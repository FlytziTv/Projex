"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupInput,
  InputGroupLabel,
  InputGroupTextarea,
} from "../../ui/MyInput";
import { useState } from "react";
import { createProject } from "@/lib/api/projects";

type Props = { onClose: () => void };

export function AddProjectDialog({ onClose }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createProject({
        name,
        description,
        status,
      });
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <Dialog.Title className="font-heading text-base leading-none font-medium">
            Ajout d&apos;un projet
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <InputGroup>
              <InputGroupLabel>Nom du projet</InputGroupLabel>
              <InputGroupInput
                type="text"
                placeholder="Ex: Creation d'une API REST..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputGroupLabel>Note / Description (optionnel)</InputGroupLabel>
              <InputGroupTextarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of the project..."
                disabled={isLoading}
              />
            </InputGroup>

            <InputGroup>
              <InputGroupLabel>Status</InputGroupLabel>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
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
                  Futur (Future)
                </option>
              </select>
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer"
                >
                  Annuler
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="bg-foreground hover:bg-foreground/70 text-background font-medium py-2 px-6 rounded-md transition-colors disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:opacity-50 duration-200 cursor-pointer"
              >
                {isLoading ? "Création..." : "Ajouter le projet"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
