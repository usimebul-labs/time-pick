import { create } from 'zustand';

interface SelectState {
    selectedDates: Date[];
    selectedParticipantIds: string[];

    setSelectedDates: (dates: Date[] | ((prev: Date[]) => Date[])) => void;
    toggleParticipant: (id: string) => void;
    reset: () => void;
}

export const useSelectStore = create<SelectState>((set) => ({
    selectedDates: [],
    selectedParticipantIds: [],

    setSelectedDates: (dates) => set((state) => ({
        selectedDates: typeof dates === 'function' ? dates(state.selectedDates) : dates
    })),

    toggleParticipant: (id) => set((state) => {
        const prev = state.selectedParticipantIds;
        if (prev.includes(id)) {
            return { selectedParticipantIds: prev.filter((pid) => pid !== id) };
        } else {
            return { selectedParticipantIds: [...prev, id] };
        }
    }),

    reset: () => set({ selectedDates: [], selectedParticipantIds: [] }),
}));
