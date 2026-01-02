"use server";

import { createServerClient } from "@repo/database";
import { DashboardCalendar } from "./types";

export async function getCalendars(): Promise<{ calendars: DashboardCalendar[]; error?: string; }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { calendars: [] };
    try {
        // 1. Get calendar IDs where user is a participant
        const { data: participations, error: pError } = await supabase
            .from('participants')
            .select('calendar_id')
            .eq('user_id', user.id);


        if (pError) throw new Error(pError.message);

        const calendarIds = participations?.map(p => p.calendar_id) || [];

        // 2. Fetch calendars (without ambiguous embedding)
        let query = supabase
            .from('calendars')
            .select('*')
            .order('created_at', { ascending: false })
            .or(`host_id.eq.${user.id},id.in.(${calendarIds.join(',')})`);

        const { data: calendarsData, error: cError } = await query;
        if (cError) throw new Error(cError.message);

        const fetchedCalendars = calendarsData || [];
        const fetchedCalendarIds = fetchedCalendars.map((c: any) => c.id);

        // 3. Fetch participants for these calendars manually
        // This avoids the "more than one relationship" error caused by ambiguous FK paths
        let participantsMap: Record<string, any[]> = {};
        if (fetchedCalendarIds.length > 0) {
            const { data: allParticipants, error: apError } = await supabase
                .from('participants')
                .select(`
                    *,
                    user:profiles (*)
                `)
                .in('calendar_id', fetchedCalendarIds)
                .order('created_at', { ascending: true }); // Preserve ordering

            if (apError) throw new Error(apError.message);

            (allParticipants || []).forEach((p: any) => {
                if (!participantsMap[p.calendar_id]) {
                    participantsMap[p.calendar_id] = [];
                }
                participantsMap[p.calendar_id]!.push(p);
            });
        }

        const calendars: DashboardCalendar[] = fetchedCalendars.map((c: any) => {
            const isHost = c.host_id === user.id;
            const isConfirmed = c.is_confirmed;

            let type: 'created' | 'joined' | 'confirmed' = 'joined';
            if (isConfirmed) {
                type = 'confirmed';
            } else if (!isHost) {
                type = 'joined';
            } else {
                type = 'created';
            }

            const calendarParticipants = participantsMap[c.id] || [];

            return {
                id: c.id,
                title: c.title,
                startDate: c.start_date, // Supabase returns string YYYY-MM-DD for date type
                endDate: c.end_date,
                deadline: c.deadline,
                isConfirmed,
                isHost,
                createdAt: c.created_at,
                participants: calendarParticipants.map((ep: any) => ({
                    name: ep.name,
                    avatarUrl: ep.user?.avatar_url || null,
                    userId: ep.user_id
                })),
                type
            };
        });

        return { calendars };
    } catch (e) {
        console.error("Error fetching dashboard data:", e);
        return { calendars: [], error: "일정을 불러오는 중 오류가 발생했습니다." };
    }
}
