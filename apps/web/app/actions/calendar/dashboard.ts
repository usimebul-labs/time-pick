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

        // 2. Fetch calendars with details
        let query = supabase
            .from('calendars')
            .select(`
                *,
                participants (
                    *,
                    user:profiles (*)
                )
            `)
            .order('created_at', { ascending: false })
            .order('created_at', { foreignTable: 'participants', ascending: true })
            .or(`host_id.eq.${user.id},id.in.(${calendarIds.join(',')})`);


        const { data: calendarsData, error: cError } = await query;
        if (cError) throw new Error(cError.message);

        const calendars: DashboardCalendar[] = (calendarsData || []).map((c: any) => {
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

            return {
                id: c.id,
                title: c.title,
                startDate: c.start_date, // Supabase returns string YYYY-MM-DD for date type
                endDate: c.end_date,
                deadline: c.deadline,
                isConfirmed,
                isHost,
                createdAt: c.created_at,
                participants: (c.participants || []).map((ep: any) => ({
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
