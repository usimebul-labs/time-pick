"use server";

import { createServerClient } from "@repo/database";

export async function bulkDeleteCalendars(ids: string[]): Promise<{ success: boolean; error?: string }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "로그인이 필요합니다." };

    try {
        // Fetch calendars to determine ownership
        const { data: calendars, error: findError } = await supabase
            .from('calendars')
            .select('id, host_id')
            .in('id', ids);

        if (findError || !calendars) return { success: false, error: "일정을 찾을 수 없습니다." };

        const ownIds = calendars.filter(c => c.host_id === user.id).map(c => c.id);
        const joinedIds = calendars.filter(c => c.host_id !== user.id).map(c => c.id);

        if (ownIds.length > 0) {
            const { error: deleteError } = await supabase
                .from('calendars')
                .delete()
                .in('id', ownIds);

            if (deleteError) throw new Error(deleteError.message);
        }

        if (joinedIds.length > 0) {
            const { error: leaveError } = await supabase
                .from('participants')
                .delete()
                .eq('user_id', user.id)
                .in('calendar_id', joinedIds);

            if (leaveError) throw new Error(leaveError.message);
        }

        return { success: true };

    } catch (e) {
        console.error("Error bulk deleting calendars:", e);
        return { success: false, error: "일정 삭제 중 오류가 발생했습니다." };
    }
}
