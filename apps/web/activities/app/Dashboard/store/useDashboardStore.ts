import { create } from 'zustand';

interface Participant {
    name: string;
    avatarUrl: string | null;
    userId: string | null;
}

interface DashboardState {
    // Share Dialog
    isShareOpen: boolean;
    shareEventId: string | null;
    openShare: (eventId: string) => void;
    closeShare: () => void;

    // Menu Sheet
    isMenuOpen: boolean;
    menuScheduleId: string | null;
    openMenu: (scheduleId: string) => void;
    closeMenu: () => void;

    // Participant Sheet
    isParticipantOpen: boolean;
    selectedParticipants: Participant[];
    selectedParticipantCount: number;
    openParticipant: (participants: Participant[], count: number) => void;
    closeParticipant: () => void;
    // Refresh Trigger
    refreshTrigger: number;
    triggerRefresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    // Share Dialog
    isShareOpen: false,
    shareEventId: null,
    openShare: (eventId) => set({ isShareOpen: true, shareEventId: eventId }),
    closeShare: () => set({ isShareOpen: false, shareEventId: null }),

    // Menu Sheet
    isMenuOpen: false,
    menuScheduleId: null,
    openMenu: (scheduleId) => set({ isMenuOpen: true, menuScheduleId: scheduleId }),
    closeMenu: () => set({ isMenuOpen: false, menuScheduleId: null }),

    // Participant Sheet
    isParticipantOpen: false,
    selectedParticipants: [],
    selectedParticipantCount: 0,
    openParticipant: (participants, count) => set({
        isParticipantOpen: true,
        selectedParticipants: participants,
        selectedParticipantCount: count
    }),
    closeParticipant: () => set({
        isParticipantOpen: false,
        selectedParticipants: [],
        selectedParticipantCount: 0
    }),
    // Refresh Trigger
    refreshTrigger: 0,
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
