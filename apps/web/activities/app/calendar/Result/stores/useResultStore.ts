import { create } from "zustand";

interface ResultState {
    isInfoOpen: boolean;
    isShareOpen: boolean;

    toggleInfo: () => void;
    setShareOpen: (isOpen: boolean) => void;
    reset: () => void;
}

export const useResultStore = create<ResultState>((set) => ({
    isInfoOpen: false,
    isShareOpen: false,

    toggleInfo: () => set((state) => ({ isInfoOpen: !state.isInfoOpen })),
    setShareOpen: (isShareOpen) => set({ isShareOpen }),
    reset: () => set({ isInfoOpen: false, isShareOpen: false }),
}));
