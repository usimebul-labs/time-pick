import { useEffect, useState } from "react";
import { useGuestStore } from "@/common/stores/useGuestStore";
import { useCalendarQuery } from "@/common/queries/useCalendarQuery";
import { useFlow } from "@/stackflow";
import { useActivity } from "@stackflow/react";
import { CalendarDetail, ParticipantDetail, ParticipantSummary } from "@/app/actions/calendar";

export function useSelectData(id: string) {
    const { replace } = useFlow();
    const activity = useActivity();

    const [calendar, setCalendar] = useState<CalendarDetail | null>(null);
    const [participation, setParticipation] = useState<ParticipantDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [guestPin, setGuestPin] = useState<string | undefined>(undefined);

    // Use Query hook
    const { data } = useCalendarQuery(id, guestPin);

    // Derived state from query data
    useEffect(() => {
        if (!data) return;

        const { calendar, participation, isLoggedIn, error } = data;

        if (calendar?.isConfirmed) {
            replace("Result", { id });
            return;
        }

        const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
        const guestPin = guestSessions[id];
        setGuestPin(guestPin);

        if (error) {
            setError(error);
        } else {
            const pendingGuest = useGuestStore.getState().pendingGuest;
            const isPendingGuest = pendingGuest && pendingGuest.calendarId === id;

            if (!participation && !guestPin && !isLoggedIn && !isPendingGuest) {
                replace("Join", { id });
                return;
            }

            if (participation && activity.name !== "SelectEdit") {
                replace("Status", { id });
                return;
            }

            setCalendar(calendar);
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
        calendar,
        participation,
        participants,
        loading,
        error,
        isLoggedIn,
        guestPin
    };
}
