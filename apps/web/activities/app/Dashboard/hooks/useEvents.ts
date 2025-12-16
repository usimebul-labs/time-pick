import { DashboardEvent, getMySchedules, getJoinedSchedules } from "@/app/actions/calendar";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// Constants
export const INITIAL_DISPLAY_COUNT = 3;

export function useEvents(user: User, type: "my" | "joined") {
    const [events, setEvents] = useState<DashboardEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const init = async () => {
            const { schedules, error } = type === "my" ? await getMySchedules(user) : await getJoinedSchedules(user);
            if (error) setError(error);
            else setEvents(schedules);

            setLoading(false);
        }

        init();
    }, []);

    return {
        events,
        loading,
        error
    };
}

