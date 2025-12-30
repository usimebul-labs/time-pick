'use client';

import { createBrowserClient } from '@repo/database';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const supabase = createBrowserClient();

    useEffect(() => {
        const channel = supabase.channel('global_changes')
            // Listen to changes on 'calendars' table
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'calendars' },
                (payload) => {
                    console.log('Realtime change received for calendars:', payload);
                    // Invalidate dashboard calendars list
                    queryClient.invalidateQueries({ queryKey: ['calendars'] });

                    // If a specific calendar changed, we might want to invalidate that specific calendar query too, 
                    // though 'calendars' list invalidation might be enough for dashboard. 
                    // But for single calendar view updates:
                    if (payload.new && 'id' in payload.new) {
                        queryClient.invalidateQueries({ queryKey: ['calendar', payload.new.id] });
                    }
                    // Handle DELETE case where payload.new might be null/different structure or old is present
                    if (payload.old && 'id' in payload.old) {
                        queryClient.invalidateQueries({ queryKey: ['calendar', payload.old.id] });
                    }
                }
            )
            // Listen to changes on 'participants' table
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'participants' },
                (payload) => {
                    console.log('Realtime change received for participants:', payload);
                    const record = payload.new ?? payload.old;
                    if (record && 'calendar_id' in record) {
                        queryClient.invalidateQueries({ queryKey: ['calendar', record.calendar_id] });
                    }
                    queryClient.invalidateQueries({ queryKey: ['calendars'] });
                }
            )
            // Listen to changes on 'availabilities' table
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'availabilities' },
                (payload) => {
                    console.log('Realtime change received for availabilities:', payload);
                    const record = payload.new ?? payload.old;
                    if (record && 'calendar_id' in record) {
                        queryClient.invalidateQueries({ queryKey: ['calendar', record.calendar_id] });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, supabase]);

    return <>{children}</>;
}
