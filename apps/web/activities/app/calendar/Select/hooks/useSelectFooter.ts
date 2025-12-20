"use client";

import { useSelectStore } from "./useSelectStore";
import { useSelectAction } from "./useSelectAction";
import { CalendarDetail, ParticipantDetail } from "@/app/actions/calendar";

export function useSelectFooter(
    id: string,
    calendar: CalendarDetail | null,
    participation: ParticipantDetail | null,
    isLoggedIn: boolean
) {
    const { selectedDates } = useSelectStore();

    // Reuse the existing action logic, injecting the store state
    const { handleComplete } = useSelectAction(id, calendar, participation, isLoggedIn, selectedDates);

    return {
        selectedCount: selectedDates.length,
        handleComplete
    };
}
