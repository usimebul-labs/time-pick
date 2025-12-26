import { create } from 'zustand';
import { DashboardCalendar } from "@/app/actions/calendar/types";

interface DashboardState {
    // Shared State
    calendar: DashboardCalendar | null;

    // Share Dialog
    isShareOpen: boolean;
    openShare: (calendar: DashboardCalendar) => void;
    closeShare: () => void;

    // Menu Sheet
    isMenuOpen: boolean;
    openMenu: (calendar: DashboardCalendar) => void;
    closeMenu: () => void;

    // Participant Sheet
    isParticipantOpen: boolean;
    openParticipant: (calendar: DashboardCalendar) => void;
    closeParticipant: () => void;

    // List Filter & Sort
    filter: 'all' | 'created' | 'joined' | 'confirmed';
    sort: 'created' | 'deadline';
    setFilter: (filter: 'all' | 'created' | 'joined' | 'confirmed') => void;
    setSort: (sort: 'created' | 'deadline') => void;

    // Refresh Trigger
    refreshTrigger: number;
    triggerRefresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    // Shared State
    calendar: null,

    // Share Dialog
    isShareOpen: false,
    openShare: (calendar) => set({ isShareOpen: true, calendar }),
    closeShare: () => set({ isShareOpen: false, calendar: null }),

    // Menu Sheet
    isMenuOpen: false,
    openMenu: (calendar) => set({ isMenuOpen: true, calendar }),
    closeMenu: () => set({ isMenuOpen: false, calendar: null }),

    // Participant Sheet
    isParticipantOpen: false,
    openParticipant: (calendar) => set({ isParticipantOpen: true, calendar }),
    closeParticipant: () => set({ isParticipantOpen: false, calendar: null }),

    // List Filter & Sort
    filter: 'all',
    sort: 'created',
    setFilter: (filter) => set({ filter }),
    setSort: (sort) => set({ sort }),

    // Refresh Trigger
    refreshTrigger: 0,
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
