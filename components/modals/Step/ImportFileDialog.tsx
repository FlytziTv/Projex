"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { Upload, FileJson, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { importSteps } from "@/lib/api/import";

export default function StepImporter({ projectId }: { projectId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/json") {
      processFile(file);
    } else {
      alert("Please drop a valid JSON file.");
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.steps) throw new Error("Format JSON invalide");

        setIsImporting(true);
        await importSteps(projectId, json.steps);
        setIsOpen(false);
        router.refresh();
      } catch (err) {
        alert("Erreur lors de la lecture du fichier JSON");
        console.error(err);
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border text-sm h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200 cursor-pointer shadow-sm"
          title="Import JSON steps"
        >
          <Upload size={14} />
          Import
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <Dialog.Title className="text-lg font-semibold leading-none ">
            Import Project Steps
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground ">
            Select a JSON file containing the roadmap steps for this project.
          </Dialog.Description>

          <div className="flex flex-col gap-6">
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-md p-3 flex gap-3 items-start">
              <p className="text-xs text-orange-500 leading-relaxed">
                <span className="font-bold">Warning :</span> The import of a new
                file will permanently delete all current steps in the Kanban and
                replace them with those from the JSON.
              </p>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group",
                isDragging
                  ? "border-sz-1 bg-sz-1/5 scale-[1.02]"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
                className="hidden"
              />
              <div
                className={cn(
                  "p-3 rounded-full transition-transform",
                  isDragging
                    ? "bg-sz-1/20 scale-110"
                    : "bg-muted group-hover:scale-110",
                )}
              >
                <FileJson
                  className={isDragging ? "text-sz-1" : "text-muted-foreground"}
                  size={24}
                />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {isDragging
                  ? "Drop to import!"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                JSON files only
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>

              {isImporting && (
                <div className="flex items-center gap-2 text-sm text-sz-1 animate-pulse">
                  <Loader2 size={16} className="animate-spin" />
                  Importing steps...
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
