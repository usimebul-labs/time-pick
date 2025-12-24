import { DashboardCalendar, getMySchedules, getJoinedSchedules } from "@/app/actions/calendar";
import { User } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useDashboardStore } from "./useDashboardStore";
import { useQuery } from "@tanstack/react-query";

export function useCalendars(user: User) {
    // Store
    const { filter, sort } = useDashboardStore();

    // 1. Fetch Data with React Query
    const { data: allCalendars = [], isLoading: loading, error } = useQuery({
        queryKey: ['calendars', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const [myResult, joinedResult] = await Promise.all([
                getMySchedules(user),
                getJoinedSchedules(user)
            ]);

            if (myResult.error) throw new Error(myResult.error);
            if (joinedResult.error) throw new Error(joinedResult.error);

            // Merge Lists
            return [...myResult.schedules, ...joinedResult.schedules];
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // 2. Client-side Filter & Sort
    const filteredCalendars = useMemo(() => {
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
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return result;
    }, [allCalendars, filter, sort]);

    return {
        calendars: filteredCalendars,
        loading,
        error: error instanceof Error ? error.message : null
    };
}
