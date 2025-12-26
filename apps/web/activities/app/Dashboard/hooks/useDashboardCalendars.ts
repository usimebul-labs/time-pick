import { getCalendars } from "@/app/actions/calendar";
import { User } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useDashboardStore } from "./useDashboardStore";
import { useQuery } from "@tanstack/react-query";

export function useDashboardCalendars(user: User) {
    const { filter, sort } = useDashboardStore();

    const { data: allCalendars = [], isLoading: loading, error } = useQuery({
        queryKey: ['calendars', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { calendars, error } = await getCalendars(user);
            if (error) throw new Error(error);
            return calendars;
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });

    const filteredCalendars = useMemo(() => {
        let result = [...allCalendars];

        if (filter === 'created')
            result = result.filter(c => c.type === 'created');
        else if (filter === 'joined')
            result = result.filter(c => c.type === 'joined');
        else if (filter === 'confirmed')
            result = result.filter(c => c.type === 'confirmed');

        result.sort((a, b) => {
            if (sort === 'deadline') {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            } else
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return result;
    }, [allCalendars, filter, sort]);

    return {
        calendars: filteredCalendars,
        loading,
        error: error instanceof Error ? error.message : null
    };
}
