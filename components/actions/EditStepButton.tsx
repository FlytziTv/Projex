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
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/projects/${step.project_id}/steps/${step.number}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title, note: note }),
        },
      );

      if (response.ok) {
        setIsEditing(false); // On quitte le mode édition
        onStepUpdated(); // On dit au parent de recharger les données
      } else {
        console.error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
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
