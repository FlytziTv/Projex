// components/ProjectSettings.tsx
"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useModalStore } from "@/store/modal.store";

export default function ProjectSettings({
  project,
}: {
  project: { id: string; name: string; description: string };
}) {
  const open = useModalStore((s) => s.open);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center justify-center bg-card border border-border w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200 cursor-pointer shadow-sm">
          <Ellipsis size={16} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[160px] bg-popover border border-border p-1 rounded-md shadow-md"
          sideOffset={5}
        >
          <DropdownMenu.Item
            onSelect={() =>
              open({
                type: "editProject",
                projectId: project.id,
                name: project.name,
                description: project.description,
              })
            }
            className="flex items-center gap-2 px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-muted rounded-sm transition-colors"
          >
            <Pencil size={14} /> Modifier
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item
            onSelect={() =>
              open({ type: "deleteProject", projectId: project.id })
            }
            className="flex items-center gap-2 px-2 py-1.5 text-sm text-destructive outline-none cursor-pointer hover:bg-destructive/10 rounded-sm transition-colors"
          >
            <Trash2 size={14} /> Supprimer
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
