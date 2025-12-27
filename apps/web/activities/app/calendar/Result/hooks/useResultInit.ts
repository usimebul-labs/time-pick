import { useResult } from "../useResult"; // Re-using existing logic but wrapping it if needed, or we can just stick to `useResult` as "useResultInit" since it's already doing exactly that.
// However, to follow the pattern, we might want to rename `useResult.ts` to `hooks/useResultInit.ts` or similar.
// For now, let's create a clean hook that might use the existing logic or replace it.
// The existing `useResult` fetches data. Let's modernize it to be `useResultInit`.

import { useState, useEffect } from "react";
import { getConfirmedCalendarResult, ConfirmedCalendarResult } from "@/app/actions/calendar";

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
