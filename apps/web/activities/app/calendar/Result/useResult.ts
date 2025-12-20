import { useState, useEffect } from "react";
import { getConfirmedCalendarResult, ConfirmedCalendarResult } from "@/app/actions/calendar";

export function useResult(calendarId: string) {
    const [resultData, setResultData] = useState<ConfirmedCalendarResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchResult() {
            try {
                const { data, error } = await getConfirmedCalendarResult(calendarId);

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

        fetchResult();

        return () => {
            isMounted = false;
        };
    }, [calendarId]);

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
        calendar: resultData?.calendar || null,
        confirmation: resultData?.confirmation || null,
        participants: resultData?.participants || [],
        isLoading,
        error,
        handleShare
    };
}
