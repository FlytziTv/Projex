"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateToken } from "@/lib/api/tokens";
import { InputGroup, InputGroupInput, InputGroupLabel } from "../../ui/MyInput";

type Props = { tokenId: string; label: string; onClose: () => void };

export default function EditTokenDialog({ tokenId, label, onClose }: Props) {
  const [labelValue, setLabelValue] = useState(label);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateToken(tokenId, labelValue);
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
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
            Modifier le token
          </Dialog.Title>
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <InputGroup>
              <InputGroupLabel>Nom du token</InputGroupLabel>
              <InputGroupInput
                type="text"
                placeholder="Ex: Mon token API..."
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                disabled={isSaving}
              />
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
                disabled={isSaving || !labelValue.trim()}
                className="bg-foreground hover:bg-foreground/70 text-background font-medium py-2 px-6 rounded-md transition-colors disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:opacity-50 duration-200 cursor-pointer"
              >
                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
