import { createBrowserClient } from "@repo/database";
import { useFlow } from "@/stackflow";
import { useEffect, useState } from "react";

export function useJoinInit(calendarId: string) {
    const { replace } = useFlow();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createBrowserClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                replace("Select", { id: calendarId }, { animate: false });
                return;
            }

            const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
            if (guestSessions[calendarId]) {
                replace("Select", { id: calendarId }, { animate: false });
                return;
            }

            setIsLoading(false);
        };

        checkSession();
    }, [calendarId, replace]);

    return { isLoading };
}
