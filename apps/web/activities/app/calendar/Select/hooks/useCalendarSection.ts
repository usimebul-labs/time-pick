"use client";

import { useSelectStore } from "./useSelectStore";

export function useCalendarSection() {
    const { selectedDates, setSelectedDates, selectedParticipantIds } = useSelectStore();

    return {
        selectedDates,
        onSelectDates: setSelectedDates,
        selectedParticipantIds
    };
}
