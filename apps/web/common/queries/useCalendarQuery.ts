import { useQuery } from '@tanstack/react-query';
import { getCalendarWithParticipation } from '@/app/actions/calendar';

export const useCalendarQuery = (calendarId: string, guestPin?: string) => {
    return useQuery({
        queryKey: ['calendar', calendarId, guestPin],
        queryFn: () => getCalendarWithParticipation(calendarId, guestPin),
        staleTime: 1000,
    });
};
