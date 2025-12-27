import { create } from "zustand";

interface AdditionalInfo {
    location: string;
    transport: string;
    parking: string;
    fee: string;
    bank: string;
    inquiry: string;
    memo: string;
}

interface ConfirmState {
    // Selection State
    selectedParticipantIds: Set<string>;
    duration: number; // For weekly: duration in hours. Default 1.
    selectedTime: string; // For monthly: specific time string "HH:mm". Default "12:00"
    selectedEndTime: string; // For monthly: End Time (optional)
    selectedRankIndex: number | null; // Default to 0 (1st rank)

    // Additional Info State
    additionalInfo: AdditionalInfo;
    isLocationSearchOpen: boolean;

    // Submission State
    isSubmitting: boolean;

    // Actions
    toggleParticipant: (id: string) => void;
    clearParticipants: () => void;
    setDuration: (duration: number) => void;
    setSelectedTime: (time: string) => void;
    setSelectedEndTime: (time: string) => void;
    setSelectedRankIndex: (index: number | null) => void;
    setAdditionalInfo: (info: AdditionalInfo | ((prev: AdditionalInfo) => AdditionalInfo)) => void;
    updateAdditionalInfoField: (field: keyof AdditionalInfo, value: string) => void;
    setIsLocationSearchOpen: (isOpen: boolean) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    reset: () => void;
}

const initialAdditionalInfo: AdditionalInfo = {
    location: "",
    transport: "",
    parking: "",
    fee: "",
    bank: "",
    inquiry: "",
    memo: ""
};

export const useConfirmStore = create<ConfirmState>((set) => ({
    selectedParticipantIds: new Set(),
    duration: 1,
    selectedTime: "12:00",
    selectedEndTime: "",
    selectedRankIndex: 0,
    additionalInfo: initialAdditionalInfo,
    isLocationSearchOpen: false,
    isSubmitting: false,

    toggleParticipant: (id) => set((state) => {
        const next = new Set(state.selectedParticipantIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return { selectedParticipantIds: next };
    }),

    clearParticipants: () => set({ selectedParticipantIds: new Set() }),

    setDuration: (duration) => set({ duration }),
    setSelectedTime: (selectedTime) => set({ selectedTime }),
    setSelectedEndTime: (selectedEndTime) => set({ selectedEndTime }),
    setSelectedRankIndex: (selectedRankIndex) => set({ selectedRankIndex }),

    setAdditionalInfo: (info) => set((state) => ({
        additionalInfo: typeof info === 'function' ? info(state.additionalInfo) : info
    })),

    updateAdditionalInfoField: (field, value) => set((state) => ({
        additionalInfo: { ...state.additionalInfo, [field]: value }
    })),

    setIsLocationSearchOpen: (isLocationSearchOpen) => set({ isLocationSearchOpen }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    reset: () => set({
        selectedParticipantIds: new Set(),
        duration: 1,
        selectedTime: "12:00",
        selectedEndTime: "",
        selectedRankIndex: 0,
        additionalInfo: initialAdditionalInfo,
        isLocationSearchOpen: false,
        isSubmitting: false,
    })
}));
