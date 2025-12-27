import { ConfirmedCalendarResult, getConfirmedCalendarResult } from "@/app/actions/calendar";
import { useEffect, useState } from "react";

export function useResultInit(calendarId: string) {
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

    return {
        calendar: resultData?.calendar || null,
        event: resultData?.event || null,
        participants: resultData?.participants || [],
        isLoading,
        error
    };
}
