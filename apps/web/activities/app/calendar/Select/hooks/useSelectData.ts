"use client";

import { useEffect, useState } from "react";
import { useGuestStore } from "@/stores/guest";
import { useEventQuery } from "@/hooks/queries/useEventQuery";
import { useFlow } from "@/stackflow";
import { useActivity } from "@stackflow/react";
import { EventDetail, ParticipantDetail, ParticipantSummary } from "@/app/actions/calendar";

export function useSelectData(id: string) {
    const { replace } = useFlow();
    const activity = useActivity();

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [participation, setParticipation] = useState<ParticipantDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [guestPin, setGuestPin] = useState<string | undefined>(undefined);

    // Initial load of guest PIN
    useEffect(() => {
        const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
        setGuestPin(guestSessions[id]);
    }, [id]);

    // Use Query hook
    const { data } = useEventQuery(id, guestPin);

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
                replace("Status", { id });
                return;
            }

            setEvent(event);
            setParticipation(participation);
            setIsLoggedIn(isLoggedIn);
        }
        setLoading(false);
    }, [data, id, replace, activity.name]);

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

    return {
        event,
        participation,
        participants,
        loading,
        error,
        isLoggedIn,
        guestPin
    };
}
