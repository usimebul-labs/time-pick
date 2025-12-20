import { DashboardCalendar, getMySchedules, getJoinedSchedules } from "@/app/actions/calendar";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useDashboardStore } from "./useDashboardStore";

// Constants
export const INITIAL_DISPLAY_COUNT = 3;

export function useCalendars(user: User, type: "my" | "joined") {
    const [calendars, setCalendars] = useState<DashboardCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { refreshTrigger } = useDashboardStore();

    useEffect(() => {
        const init = async () => {
            const { schedules, error } = type === "my" ? await getMySchedules(user) : await getJoinedSchedules(user);
            if (error) setError(error);
            else setCalendars(schedules);

            setLoading(false);
        }

        init();
    }, [refreshTrigger]);

    return {
        calendars,
        loading,
        error
    };
}

