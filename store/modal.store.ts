import { create } from "zustand";

type ModalType =
  | {
      type: "editProject";
      projectId: string;
      name: string;
      description: string;
    }
  | { type: "deleteProject"; projectId: string };

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
