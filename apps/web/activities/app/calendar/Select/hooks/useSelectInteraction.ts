"use client";

import { useEffect, useRef } from "react";
import { parseISO, isSameDay } from "date-fns";
import { ParticipantSummary, ParticipantDetail, EventDetail } from "@/app/actions/calendar";

interface UseSelectInteractionProps {
    event: EventDetail | null;
    participants: ParticipantSummary[];
    participation: ParticipantDetail | null;
    selectedDates: Date[];
    selectedParticipantIds: string[];
    setSelectedDates: (dates: Date[] | ((prev: Date[]) => Date[])) => void;
    toggleParticipant: (id: string) => void;
    reset: () => void;
}

export function useSelectInteraction({
    event,
    participants,
    participation,
    selectedDates,
    selectedParticipantIds,
    setSelectedDates,
    reset
}: UseSelectInteractionProps) {

    // Reset store on mount/unmount to ensure clean state for new event
    // Using empty dependency array means it runs on mount and unmount
    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);


    // Initialize selectedDates from participation (only once when loaded)
    const initializedRef = useRef(false);
    useEffect(() => {
        if (participation?.availabilities && !initializedRef.current) {
            setSelectedDates(participation.availabilities.map((d) => parseISO(d)));
            initializedRef.current = true;
        }
    }, [participation, setSelectedDates]);

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
        handleSelectHighlighted
    };
}
