"use client";
import { useModalStore } from "@/store/modal.store";
import { EditProjectDialog } from "./EditProjectDialog";
import { DeleteProjectAlert } from "./DeleteProjectAlert";

export function ModalProvider() {
  const { modal, close } = useModalStore();

  if (!modal) return null;

  return (
    <>
      {modal.type === "editProject" && (
        <EditProjectDialog
          projectId={modal.projectId}
          name={modal.name}
          description={modal.description}
          onClose={close}
        />
      )}
      {modal.type === "deleteProject" && (
        <DeleteProjectAlert {...modal} onClose={close} />
      )}
    </>
  );
}
