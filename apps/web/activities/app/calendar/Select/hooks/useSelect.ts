"use client";

import { differenceInCalendarDays, isSameDay, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { EventDetail, getEventWithParticipation, ParticipantDetail, ParticipantSummary } from "@/app/actions/calendar";
import { useFlow } from "@/stackflow";

export function useSelect(id: string) {
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [participation, setParticipation] = useState<ParticipantDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Selected slots (ISO strings)
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const { replace } = useFlow();

    useEffect(() => {
        const fetchEvent = async () => {
            // Get guest PIN
            const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
            const guestPin = guestSessions[id];

            const { event, participation, participants, isLoggedIn, error } = await getEventWithParticipation(id, guestPin);

            if (error) {
                setError(error);
            } else {
                // Redirect if not logged in and not a guest (no participation)
                if (!isLoggedIn && !participation) {
                    replace("Join", { id });
                    return;
                }

                setEvent(event);
                setParticipation(participation);

                // Sort participants: Me first, then others
                let sortedParticipants = participants || [];
                if (participation) {
                    const meIndex = sortedParticipants.findIndex(p => p.id === participation.id);
                    if (meIndex > -1) {
                        const me = sortedParticipants[meIndex];
                        if (me) {
                            const others = [...sortedParticipants];
                            others.splice(meIndex, 1);
                            sortedParticipants = [me, ...others];
                        }
                    }
                }
                setParticipants(sortedParticipants);
                // Default: No one selected (Show all stats)
                setSelectedParticipantIds([]);

                setIsLoggedIn(isLoggedIn);

                if (participation?.availabilities) {
                    setSelectedDates(participation.availabilities.map((d) => parseISO(d)));
                }
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id, replace]);


    const toggleParticipant = (id: string) => {
        setSelectedParticipantIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(pid => pid !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleComplete = async () => {
        if (!event) return;
        try {
            const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
            const guestPin = guestSessions[id];

            if (!participation && !guestPin && !isLoggedIn) {
                alert("로그인이 필요합니다.");
                replace("Join", { id });
                return;
            }

            const { joinSchedule } = await import("@/app/actions/calendar");
            let result = await joinSchedule(event.id, selectedDates.map(d => d.toISOString()), { pin: guestPin });

            if (result.success) {
                alert("일정이 등록되었습니다.");
                replace("Confirmed", { id: event.id });
            } else {
                alert(result.error);
            }

        } catch (e) {
            console.error(e);
            alert("오류가 발생했습니다.");
        }
    };

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

        setSelectedDates(prev => {
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

    const getDeadlineInfo = () => {
        if (!event?.deadline) return null;
        const deadlineDate = parseISO(event.deadline);
        const diff = differenceInCalendarDays(deadlineDate, new Date());
        const isUrgent = diff <= 3 && diff >= 0;

        let dDayText = "";
        if (diff < 0) dDayText = "마감됨";
        else if (diff === 0) dDayText = "D-Day";
        else dDayText = `D-${diff}`;

        return { deadlineDate, isUrgent, dDayText };
    };

    const deadlineInfo = getDeadlineInfo();

    return {
        event,
        loading,
        error,
        participants,
        participation,
        selectedParticipantIds,
        selectedDates,
        deadlineInfo,
        setSelectedDates,
        toggleParticipant,
        handleComplete,
        handleSelectHighlighted
    };
}
