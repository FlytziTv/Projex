"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupInput, InputGroupLabel } from "../ui/MyInput";

export default function ProjectSettings({
  project,
}: {
  project: { id: string; name: string; description: string };
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const router = useRouter();

  const handleUpdate = async () => {
    const res = await fetch(
      `http://localhost:3001/api/projects/${project.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      },
    );
    if (res.ok) {
      setIsEditOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (confirm("Supprimer définitivement ce projet et toutes ses étapes ?")) {
      const res = await fetch(
        `http://localhost:3001/api/projects/${project.id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        router.push("/"); // Retour au dashboard principal
      }
    }
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center justify-center bg-card border border-border w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200 cursor-pointer shadow-sm">
            <Ellipsis size={16} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[160px] bg-popover border border-border p-1 rounded-md shadow-md animate-in fade-in zoom-in-95"
            sideOffset={5}
          >
            <DropdownMenu.Item
              onSelect={() => setIsEditOpen(true)}
              className="flex items-center gap-2 px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-muted rounded-sm transition-colors"
            >
              <Pencil size={14} /> Modifier
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-border my-1" />

            <DropdownMenu.Item
              onSelect={handleDelete}
              className="flex items-center gap-2 px-2 py-1.5 text-sm text-destructive outline-none cursor-pointer hover:bg-destructive/10 rounded-sm transition-colors"
            >
              <Trash2 size={14} /> Supprimer
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Modal de Modification */}
      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <Dialog.Title className="font-heading text-base leading-none font-medium">
              Modifier le projet
            </Dialog.Title>

            <div className="flex flex-col gap-4">
              <InputGroup>
                <InputGroupLabel>Nom du projet</InputGroupLabel>
                <InputGroupInput
                  type="text"
                  placeholder="Ex: Configuration Prisma..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputGroupLabel>Description</InputGroupLabel>
                <InputGroupInput
                  type="text"
                  placeholder="Ex: Description of projet..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </InputGroup>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-foreground hover:bg-foreground/80 border text-background font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
