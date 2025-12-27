import { create } from "zustand";
import { ModifyFormState, ConflictedParticipant } from "../hooks/types";
import { ParticipantSummary } from "@/app/actions/calendar";

interface ModifyState {
    // Data State
    loading: boolean;
    participants: ParticipantSummary[];

    // Submission State
    isSubmitting: boolean;

    // Form State
    formState: ModifyFormState;

    // Conflict State
    showConflictDialog: boolean;
    conflictedParticipants: ConflictedParticipant[];
    pendingFormData: FormData | null;

    // Delete Participant State
    showDeleteDialog: boolean;
    participantToDelete: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setParticipants: (participants: ParticipantSummary[]) => void;
    removeParticipant: (id: string) => void;
    setFormState: (state: ModifyFormState) => void;
    updateForm: (updates: Partial<ModifyFormState>) => void;

    // Conflict Actions
    setConflict: (conflicted: ConflictedParticipant[], formData: FormData) => void;
    setConflictDialog: (open: boolean) => void;
    clearConflict: () => void;

    // Delete Participant Actions
    setDeleteDialog: (open: boolean) => void;
    setParticipantToDelete: (id: string | null) => void;
}

export const useModifyStore = create<ModifyState>((set) => ({
    // Initial State
    loading: true,
    participants: [],
    isSubmitting: false,
    formState: {
        title: "",
        description: "",
        scheduleType: "date",
        startDate: "",
        endDate: "",
        startHour: 9,
        endHour: 18,
        enabledDays: [],
        excludeHolidays: false,
        excludedDates: [],
        deadline: "",
    },
    showConflictDialog: false,
    conflictedParticipants: [],
    pendingFormData: null,
    showDeleteDialog: false,
    participantToDelete: null,

    // Actions
    setLoading: (loading) => set({ loading }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setParticipants: (participants) => set({ participants }),
    removeParticipant: (id) => set((state) => ({
        participants: state.participants.filter((p) => p.id !== id),
    })),
    setFormState: (formState) => set({ formState }),
    updateForm: (updates) => set((state) => ({
        formState: { ...state.formState, ...updates },
    })),

    setConflict: (conflictedParticipants, pendingFormData) => set({
        conflictedParticipants,
        pendingFormData,
        showConflictDialog: true,
    }),
    setConflictDialog: (showConflictDialog) => set({ showConflictDialog }),
    clearConflict: () => set({
        conflictedParticipants: [],
        pendingFormData: null,
        showConflictDialog: false,
    }),

    setDeleteDialog: (showDeleteDialog) => set({ showDeleteDialog }),
    setParticipantToDelete: (participantToDelete) => set({ participantToDelete }),
}));
