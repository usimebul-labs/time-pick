"use client";

import { useSelectStore } from "./useSelectStore";
import { EventDetail, ParticipantSummary } from "@/app/actions/calendar";
import { parseISO, isSameDay } from "date-fns";

export function useParticipantList(
    event: EventDetail | null,
    participants: ParticipantSummary[]
) {
    const {
        selectedParticipantIds,
        toggleParticipant,
        setSelectedDates
    } = useSelectStore();

    const handleSelectHighlighted = () => {
        if (selectedParticipantIds.length === 0) return;
        const selectedUsers = participants.filter(p => selectedParticipantIds.includes(p.id));
        if (selectedUsers.length === 0) return;

        let additionalDates: Date[] = [];

        if (event?.type === 'monthly') {
            const baseUser = selectedUsers[0];
            const candidateDays = baseUser?.availabilities.map(a => parseISO(a)) || [];

            const commonDays = candidateDays.filter(candidateDay => {
                return selectedUsers.every(user =>
                    user.availabilities.some(a => isSameDay(parseISO(a), candidateDay))
                );
            });

            additionalDates = commonDays;
        } else {
            const baseUser = selectedUsers[0];
            const candidateSlots = baseUser?.availabilities || [];

            const commonSlots = candidateSlots.filter(slot =>
                selectedUsers.every(user => user.availabilities.includes(slot))
            );

            additionalDates = commonSlots.map(s => parseISO(s));
        }

        setSelectedDates((prev: Date[]) => {
            const newSelection = [...prev];
            additionalDates.forEach(newDate => {
                const exists = event?.type === 'monthly'
                    ? newSelection.some(d => isSameDay(d, newDate))
                    : newSelection.some(d => d.toISOString() === newDate.toISOString());

                if (!exists) {
                    newSelection.push(newDate);
                }
            });
            return newSelection;
        });
    };

    return {
        selectedParticipantIds,
        onToggleParticipant: toggleParticipant,
        onSelectHighlighted: handleSelectHighlighted
    };
}
