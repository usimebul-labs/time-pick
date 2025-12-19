import { useState, useEffect } from "react";
import { getConfirmedEventResult, ConfirmedEventResult } from "@/app/actions/calendar";

export function useResult(eventId: string) {
    const [resultData, setResultData] = useState<ConfirmedEventResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchEvent() {
            try {
                const { data, error } = await getConfirmedEventResult(eventId);

                if (isMounted) {
                    if (error) {
                        setError(error);
                    } else if (data) {
                        setResultData(data);
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
            return true;
        } catch (err) {
            console.error("Failed to copy link:", err);
            return false;
        }
    };

    return {
        event: resultData?.event || null,
        confirmation: resultData?.confirmation || null,
        participants: resultData?.participants || [],
        isLoading,
        error,
        handleShare
    };
}
