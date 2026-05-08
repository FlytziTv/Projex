"use client";
import { useModalStore } from "@/store/modal.store";
import { EditProjectDialog } from "./Project/EditProjectDialog";
import { DeleteProjectAlert } from "./Project/DeleteProjectAlert";
import { EditStepDialog } from "./Step/EditStepDialog";
import { DeleteStepAlert } from "./Step/DeleteStepAlert";
import AddStepDialog from "./Step/AddStepDialog";
import ImportFileDialog from "./Step/ImportFileDialog";
import { AddProjectDialog } from "./Project/AddProjectDialog";
import AddTokenDialog from "./Token/AddTokenDialog";
import EditTokenDialog from "./Token/EditTokenDialog";
import DeleteTokenAlert from "./Token/DeleteTokenAlert";
import DeleteAccountAlert from "./Account/DeleteAccountAlert";

export function ModalProvider() {
  const { modal, close } = useModalStore();

  if (!modal) return null;

  return (
    <>
      {/* Project Modals */}
      {modal.type === "addProject" && <AddProjectDialog onClose={close} />}
      {modal.type === "editProject" && (
        <EditProjectDialog
          projectId={modal.projectId}
          name={modal.name}
          description={modal.description}
          status={modal.status}
          onClose={close}
        />
      )}
      {modal.type === "deleteProject" && (
        <DeleteProjectAlert {...modal} onClose={close} />
      )}
      {/* Step Modals */}
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
      {/* Token Modals */}
      {modal.type === "addToken" && <AddTokenDialog onClose={close} />}
      {modal.type === "editToken" && (
        <EditTokenDialog
          tokenId={modal.tokenId}
          label={modal.label}
          onClose={close}
        />
      )}
      {modal.type === "deleteToken" && (
        <DeleteTokenAlert tokenId={modal.tokenId} onClose={close} />
      )}
      {/* Account Modals */}
      {modal.type === "deleteAccount" && (
        <DeleteAccountAlert userid={modal.userid} onClose={close} />
      )}
    </>
  );
}
