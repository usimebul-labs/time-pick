import { create } from 'zustand';

interface GuestState {
    pendingGuest: {
        eventId: string;
        name: string;
    } | null;
    setPendingGuest: (eventId: string, name: string) => void;
    clearPendingGuest: () => void;
}

export const useGuestStore = create<GuestState>((set) => ({
    pendingGuest: null,
    setPendingGuest: (eventId, name) => set({ pendingGuest: { eventId, name } }),
    clearPendingGuest: () => set({ pendingGuest: null }),
}));
