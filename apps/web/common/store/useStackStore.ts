import { create } from 'zustand';

interface StackState {
    stackKey: number;
    resetStack: () => void;
}

export const useStackStore = create<StackState>((set) => ({
    stackKey: 0,
    resetStack: () => set((state) => ({ stackKey: state.stackKey + 1 })),
}));
