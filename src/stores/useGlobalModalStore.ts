import { create } from "zustand";

interface ModalState {
  show: boolean;
  mainTitle: string;
  subTitle?: string;
  imageUrl?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  open: (params: {
    mainTitle: string;
    subTitle?: string;
    imageUrl?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => void;
  close: () => void;
}

export const useGlobalModalStore = create<ModalState>((set) => ({
  show: false,
  mainTitle: "",
  subTitle: undefined,
  imageUrl: undefined,
  onConfirm: undefined,
  onClose: undefined,
  confirmText: undefined,
  cancelText: undefined,

  open: ({
    mainTitle,
    subTitle,
    imageUrl,
    onConfirm,
    onClose,
    confirmText,
    cancelText,
  }) =>
    set({
      show: true,
      mainTitle,
      subTitle,
      imageUrl,
      onConfirm,
      onClose,
      confirmText,
      cancelText,
    }),

  close: () =>
    set({
      show: false,
      mainTitle: "",
      subTitle: undefined,
      imageUrl: undefined,
      onConfirm: undefined,
      onClose: undefined,
      confirmText: undefined,
      cancelText: undefined,
    }),
}));
