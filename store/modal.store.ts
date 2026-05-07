import { create } from "zustand";

type ModalType =
  | { type: "addProject" }
  | {
      type: "editProject";
      projectId: string;
      name: string;
      description: string;
    }
  | { type: "deleteProject"; projectId: string }
  | { type: "importFile"; projectId: string }
  | { type: "addStep"; projectId: string }
  | {
      type: "editStep";
      projectId: string;
      stepNumber: number;
      title: string;
      note: string | null;
      status: string;
    }
  | { type: "deleteStep"; stepId: string };

type ModalStore = {
  modal: ModalType | null;
  open: (modal: ModalType) => void;
  close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  open: (modal) => set({ modal }),
  close: () => set({ modal: null }),
}));
