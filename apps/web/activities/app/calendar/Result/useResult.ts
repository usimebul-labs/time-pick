
import { useState, useEffect } from "react";
import { getEventWithParticipation, EventDetail, ParticipantSummary } from "@/app/actions/calendar";

export function useResult(eventId: string) {
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchEvent() {
            try {
                const { event, participants, error } = await getEventWithParticipation(eventId);

                if (isMounted) {
                    if (error) {
                        setError(error);
                    } else if (event) {
                        setEvent(event);
                        setParticipants(participants);
                    }
                }
            } catch (e) {
                if (isMounted) setError("Failed to load event");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchEvent();

        return () => {
            isMounted = false;
        };
    }, [eventId]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            // Could return specific feedback state here if needed
            return true;
        } catch (err) {
            console.error("Failed to copy link:", err);
            return false;
        }
    };

    return {
        event,
        participants,
        isLoading,
        error,
        handleShare
    };
}
