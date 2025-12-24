import { DashboardCalendar, getMySchedules, getJoinedSchedules } from "@/app/actions/calendar";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useDashboardStore } from "./useDashboardStore";

export function useCalendars(user: User) {
    const [allCalendars, setAllCalendars] = useState<DashboardCalendar[]>([]);
    const [filteredCalendars, setFilteredCalendars] = useState<DashboardCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Store
    const { refreshTrigger, filter, sort } = useDashboardStore();

    // 1. Fetch All Data
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const [myResult, joinedResult] = await Promise.all([
                getMySchedules(user),
                getJoinedSchedules(user)
            ]);

            if (myResult.error) {
                setError(myResult.error);
                setLoading(false);
                return;
            }
            if (joinedResult.error) {
                setError(joinedResult.error);
                setLoading(false);
                return;
            }

            // Merge Lists
            const combined = [...myResult.schedules, ...joinedResult.schedules];
            setAllCalendars(combined);
            setLoading(false);
        }

        if (user) {
            init();
        }
    }, [user, refreshTrigger]);

    // 2. Client-side Filter & Sort
    useEffect(() => {
        let result = [...allCalendars];

        // Filter
        if (filter === 'host') {
            result = result.filter(c => c.isHost && !c.isConfirmed);
        } else if (filter === 'joined') {
            result = result.filter(c => !c.isHost && !c.isConfirmed); // "Joined" means I'm participating but not host, and not confirmed yet
        } else if (filter === 'confirmed') {
            result = result.filter(c => c.isConfirmed);
        }

        // Sort
        result.sort((a, b) => {
            if (sort === 'deadline') {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            } else {
                // Default: Created At (Newest first)
                // Note: createdAt comes as string ISO from server action
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        setFilteredCalendars(result);
    }, [allCalendars, filter, sort]);

    return {
        calendars: filteredCalendars,
        loading,
        error
    };
}
