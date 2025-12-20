import { create } from 'zustand';

interface GuestState {
    pendingGuest: {
        calendarId: string;
        name: string;
    } | null;
    setPendingGuest: (calendarId: string, name: string) => void;
    clearPendingGuest: () => void;
}

export const useGuestStore = create<GuestState>((set) => ({
    pendingGuest: null,
    setPendingGuest: (calendarId, name) => set({ pendingGuest: { calendarId, name } }),
    clearPendingGuest: () => set({ pendingGuest: null }),
}));
