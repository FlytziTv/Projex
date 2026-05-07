"use client";
import { useModalStore } from "@/store/modal.store";
import { EditProjectDialog } from "./EditProjectDialog";
import { DeleteProjectAlert } from "./DeleteProjectAlert";
import { EditStepDialog } from "./EditStepDialog";
import { DeleteStepAlert } from "./DeleteStepAlert";
import AddStepDialog from "./AddStepDialog";
import ImportFileDialog from "./ImportFileDialog";

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
      {modal.type === "importFile" && (
        <ImportFileDialog projectId={modal.projectId} />
      )}
      {modal.type === "addStep" && (
        <AddStepDialog projectId={modal.projectId} onClose={close} />
      )}
      {modal.type === "editStep" && (
        <EditStepDialog
          projectId={modal.projectId}
          stepNumber={modal.stepNumber}
          title={modal.title}
          note={modal.note}
          status={modal.status}
          onClose={close}
        />
      )}
      {modal.type === "deleteStep" && (
        <DeleteStepAlert stepId={modal.stepId} onClose={close} />
      )}
    </>
  );
}
