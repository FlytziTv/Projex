"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  InputGroup,
  InputGroupInput,
  InputGroupLabel,
  InputGroupTextarea,
} from "../ui/MyInput";
import { Pen } from "lucide-react";
import { Step } from "@/types/project";

interface EditStepModalProps {
  step: Step;
  onStepUpdated: () => void; // Fonction pour rafraîchir le tableau après modif
}

export function EditStepForm({ step, onStepUpdated }: EditStepModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(step.title);
  const [note, setNote] = useState(step.note || "");
  const [status, setStatus] = useState(step.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. On récupère le token JWT (généralement stocké dans le localStorage à la connexion)
      const token = localStorage.getItem("projex_token");

      if (!token) {
        alert(
          "Erreur: Token introuvable. Essaie de te déconnecter / reconnecter.",
        );
        setIsSaving(false);
        return;
      }

      // 2. On tape bien sur le port 3001
      const response = await fetch(
        `http://localhost:3001/api/projects/${step.project_id}/steps/${step.number}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // On donne la clé d'accès au serveur !
          },
          body: JSON.stringify({
            title: title,
            description: note,
            status: status,
          }),
        },
      );

      if (response.ok) {
        setIsEditing(false);
        onStepUpdated();
      } else {
        // 3. On capture la VRAIE erreur envoyée par le serveur !
        const errorData = await response.json();
        console.error("Erreur renvoyée par le backend :", errorData);
        alert(`Erreur : ${errorData.error}`); // Petit popup pour toi
      }
    } catch (error) {
      console.error("Erreur réseau (serveur éteint ou CORS) :", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
      <Dialog.Trigger asChild>
        <button
          className="flex items-center justify-center bg-transparent hover:bg-muted/50 border border-transparent w-8 h-8 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
          title="Edit step"
        >
          <Pen size={14} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <Dialog.Title className="font-heading text-base leading-none font-medium">
            Edit Step
          </Dialog.Title>
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <InputGroup>
              <InputGroupLabel>Step Title</InputGroupLabel>
              <InputGroupInput
                type="text"
                placeholder="Ex: Configuration Prisma..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputGroupLabel>Note / Description (optionnel)</InputGroupLabel>
              <InputGroupTextarea
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note about the step..."
              />
            </InputGroup>

            <InputGroup>
              <InputGroupLabel>Status</InputGroupLabel>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "todo"
                      | "in_progress"
                      | "done"
                      | "skipped",
                  )
                }
                className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
              >
                <option className="text-background" value="todo">
                  À faire (Todo)
                </option>
                <option className="text-background" value="in_progress">
                  En cours (In Progress)
                </option>
                <option className="text-background" value="done">
                  Terminé (Done)
                </option>
                <option className="text-background" value="skipped">
                  Ignoré (Ignored)
                </option>
              </select>
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="bg-foreground hover:bg-foreground/70 text-background font-medium py-2 px-6 rounded-md transition-colors disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:opacity-50 duration-200 cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save Step"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
