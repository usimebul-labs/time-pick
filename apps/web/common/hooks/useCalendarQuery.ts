import { useQuery } from '@tanstack/react-query';
import { getCalendarWithParticipation } from '@/app/actions/calendar';

export const useCalendarQuery = (calendarId: string, guestPin?: string) => {
    return useQuery({
        queryKey: ['calendar', calendarId, guestPin],
        queryFn: () => getCalendarWithParticipation(calendarId, guestPin),
        refetchInterval: 2000, // Poll every 2 seconds for auto-update
        staleTime: 1000,
    });
};
