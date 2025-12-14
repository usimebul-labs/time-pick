"use client";

import { differenceInCalendarDays, isSameDay, parseISO } from "date-fns";
import { useEffect, useState, useRef } from "react";
import { EventDetail, getEventWithParticipation, ParticipantDetail, ParticipantSummary } from "@/app/actions/calendar";
import { useFlow } from "@/stackflow";
import { useEventQuery } from "@/hooks/queries/useEventQuery";

import { useActivity } from "@stackflow/react";
import { useGuestStore } from "@/stores/guest";
import { useQueryClient } from "@tanstack/react-query";

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
    const activity = useActivity();
    const queryClient = useQueryClient();

    // State for guest PIN
    const [guestPin, setGuestPin] = useState<string | undefined>(undefined);

    // Initial load of guest PIN
    useEffect(() => {
        const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
        setGuestPin(guestSessions[id]);
    }, [id]);

    // Use Query hook
    const { data, isLoading: queryLoading, error: queryError } = useEventQuery(id, guestPin);

    // Derived state from query data
    useEffect(() => {
        if (!data) return;
        const { event, participation, participants, isLoggedIn, error } = data;

        if (error) {
            setError(error);
        } else {
            // Redirect logic
            const pendingGuest = useGuestStore.getState().pendingGuest;
            const isPendingGuest = pendingGuest && pendingGuest.eventId === id;

            if (!isLoggedIn && !participation && !isPendingGuest) {
                replace("Join", { id });
                return;
            }

            if (participation && activity.name !== "SelectEdit") {
                replace("Confirmed", { id });
                return;
            }

            setEvent(event);
            setParticipation(participation);
            // setParticipants will be handled by sorting logic below or directly

            setIsLoggedIn(isLoggedIn);
        }
        setLoading(false);
    }, [data, id, replace, activity.name]);

    // Initialize selectedDates from participation (only once when loaded)
    // We use a ref to track if we've initialized to avoid overwriting user edits
    const initializedRef = useRef(false);
    useEffect(() => {
        if (data?.participation?.availabilities && !initializedRef.current) {
            setSelectedDates(data.participation.availabilities.map((d) => parseISO(d)));
            initializedRef.current = true;
        }
    }, [data?.participation]);


    // Update participants list and sort (Sync with server updates)
    useEffect(() => {
        if (data?.participants) {
            let sortedParticipants = data.participants || [];
            if (data.participation) {
                const meIndex = sortedParticipants.findIndex(p => p.id === data.participation?.id);
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
        }
    }, [data?.participants, data?.participation]);



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
            let guestPin = guestSessions[id];

            const pendingGuest = useGuestStore.getState().pendingGuest;
            const isPendingGuest = pendingGuest && pendingGuest.eventId === id;

            // 1. Create Guest if pending
            if (isPendingGuest && !guestPin) {
                const { createGuestParticipant } = await import("@/app/actions/calendar");
                const result = await createGuestParticipant(id, pendingGuest.name);

                if (result.success && result.pin) {
                    guestPin = result.pin;
                    // Persist session
                    guestSessions[id] = guestPin;
                    localStorage.setItem("guest_sessions", JSON.stringify(guestSessions));
                    useGuestStore.getState().clearPendingGuest();
                } else {
                    alert(result.error || "게스트 생성 실패");
                    return;
                }
            }

            if (!participation && !guestPin && !isLoggedIn) {
                alert("로그인이 필요합니다.");
                replace("Join", { id });
                return;
            }

            const { joinSchedule } = await import("@/app/actions/calendar");
            let result = await joinSchedule(event.id, selectedDates.map(d => d.toISOString()), { pin: guestPin });

            if (result.success) {
                await queryClient.invalidateQueries({ queryKey: ['event', id] });
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
