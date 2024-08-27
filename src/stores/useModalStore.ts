import { create } from 'zustand';

type ModalName = 'signin' | 'signup' | 'profileEdit';

interface ModalState {
  modals: Record<ModalName, boolean>;
}

interface ModalActions {
  openModal: (modalName: ModalName) => void;
  closeModal: (modalName: ModalName) => void;
  isModalOpen: (modalName: ModalName) => boolean;
}

const useModalStore = create<ModalState & ModalActions>((set, get) => ({
  modals: {
    signin: false,
    signup: false,
    profileEdit: false,
  },

  openModal: (modalName: ModalName) =>
    set((state) => {
      const updatedModals: Record<ModalName, boolean> = Object.keys(state.modals).reduce(
        (acc, key) => {
          acc[key as ModalName] = key === modalName;
          return acc;
        },
        {} as Record<ModalName, boolean>,
      );
      return {
        modals: updatedModals,
      };
    }),

  closeModal: (modalName: ModalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    })),

  isModalOpen: (modalName: ModalName) => {
    const state = get();
    return state.modals[modalName] || false;
  },
}));

export default useModalStore;
