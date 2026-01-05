import { create } from 'zustand';
import { DashboardCalendar } from "@/app/actions/calendar/types";

interface DashboardState {
    // Shared State
    selectedCalendar: DashboardCalendar | null;

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

    // Selection Mode
    isSelectionMode: boolean;
    selectedIds: string[];
    toggleSelectionMode: () => void;
    toggleCalendarSelection: (id: string) => void;
    clearSelection: () => void;
    selectAll: (ids: string[]) => void;
    unselectAll: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    // Shared State
    selectedCalendar: null,

    // Share Dialog
    isShareOpen: false,
    openShare: (calendar) => set({ isShareOpen: true, selectedCalendar: calendar }),
    closeShare: () => set({ isShareOpen: false, selectedCalendar: null }),

    // Menu Sheet
    isMenuOpen: false,
    openMenu: (calendar) => set({ isMenuOpen: true, selectedCalendar: calendar }),
    closeMenu: () => set({ isMenuOpen: false, selectedCalendar: null }),

    // Participant Sheet
    isParticipantOpen: false,
    openParticipant: (calendar) => set({ isParticipantOpen: true, selectedCalendar: calendar }),
    closeParticipant: () => set({ isParticipantOpen: false, selectedCalendar: null }),

    // List Filter & Sort
    filter: 'all',
    sort: 'created',
    setFilter: (filter) => set({ filter, isSelectionMode: false, selectedIds: [] }),
    setSort: (sort) => set({ sort }),

    // Selection Mode
    isSelectionMode: false,
    selectedIds: [],
    toggleSelectionMode: () => set((state) => ({
        isSelectionMode: !state.isSelectionMode,
        selectedIds: [] // Clear selection when toggling
    })),
    toggleCalendarSelection: (id) => set((state) => {
        const isSelected = state.selectedIds.includes(id);
        return {
            selectedIds: isSelected
                ? state.selectedIds.filter((i) => i !== id)
                : [...state.selectedIds, id]
        };
    }),
    clearSelection: () => set({ selectedIds: [] }),
    selectAll: (ids) => set({ selectedIds: ids }),
    unselectAll: () => set({ selectedIds: [] }),
}));
