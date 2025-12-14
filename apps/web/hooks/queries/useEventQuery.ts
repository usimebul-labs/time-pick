import { useQuery } from '@tanstack/react-query';
import { getEventWithParticipation } from '@/app/actions/calendar';

export const useEventQuery = (eventId: string, guestPin?: string) => {
    return useQuery({
        queryKey: ['event', eventId, guestPin],
        queryFn: () => getEventWithParticipation(eventId, guestPin),
        refetchInterval: 2000, // Poll every 2 seconds for auto-update
        staleTime: 1000,
    });
};
