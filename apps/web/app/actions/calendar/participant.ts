"use server";

import { createServerClient } from "@repo/database";


export async function joinSchedule(
    calendarId: string,
    selectedSlots: string[], // ISO strings
    guestInfo?: { name?: string; pin?: string }
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();


    try {
        let participantId: string;

        if (user) {
            // 1. User is logged in
            // Find or create participant linked to user
            const { data: existing, error: findError } = await supabase
                .from('participants')
                .select('id')
                .eq('calendar_id', calendarId)
                .eq('user_id', user.id)
                .single();

            // Ignore error if it's "Row not found" (PGRST116), handle strictly if other error? 
            // supabase-js returns error for .single() if not found.

            if (existing) {
                participantId = existing.id;
            } else {
                // Ensure profile exists
                // Upsert profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata.full_name,
                        avatar_url: user.user_metadata.avatar_url
                    });

                if (profileError) throw new Error(profileError.message);

                // Create participant
                const { data: newParticipant, error: createError } = await supabase
                    .from('participants')
                    .insert({
                        calendar_id: calendarId,
                        user_id: user.id,
                        name: user.user_metadata.full_name || "익명",
                    })
                    .select('id')
                    .single();

                if (createError) throw new Error(createError.message);
                participantId = newParticipant.id;
            }
        } else {
            // 2. Guest User
            if (guestInfo?.pin) {
                // Try to find existing guest by PIN
                const { data: existing, error: findError } = await supabase
                    .from('participants')
                    .select('id')
                    .eq('calendar_id', calendarId)
                    .eq('guest_pin', guestInfo.pin)
                    .single();

                if (existing) {
                    participantId = existing.id;
                } else {
                    return { success: false, error: "유효하지 않은 게스트 PIN입니다." };
                }
            } else if (guestInfo?.name) {
                // Create new guest participant
                const { data: newParticipant, error: createError } = await supabase
                    .from('participants')
                    .insert({
                        calendar_id: calendarId,
                        name: guestInfo.name,
                        guest_pin: guestInfo.pin // Optional
                    })
                    .select('id')
                    .single();

                if (createError) throw new Error(createError.message);
                participantId = newParticipant.id;
            } else {
                return { success: false, error: "게스트 정보가 필요합니다." };
            }
        }

        // 3. Save Availability
        // Upsert logic (Slot column is now timestamp[] array)
        const { error: upsertError } = await supabase
            .from('availabilities')
            .upsert({
                calendar_id: calendarId,
                participant_id: participantId,
                slot: selectedSlots
            }, { onConflict: 'participant_id, calendar_id' });

        if (upsertError) throw new Error(upsertError.message);

        return { success: true };

    } catch (e) {
        console.error("Error joining schedule:", e);
        return { success: false, error: "일정 등록 중 오류가 발생했습니다." };
    }
}

export async function createGuestParticipant(calendarId: string, name: string): Promise<{ success: boolean; pin?: string; error?: string }> {
    const supabase = await createServerClient();
    try {
        const pin = Math.floor(100000 + Math.random() * 900000).toString();

        const { error } = await supabase
            .from('participants')
            .insert({
                calendar_id: calendarId,
                name: name,
                guest_pin: pin
            });

        if (error) throw new Error(error.message);

        return { success: true, pin };
    } catch (e) {
        console.error("Error creating guest:", e);
        return { success: false, error: "게스트 생성 중 오류가 발생했습니다." };
    }
}

export async function loginGuestParticipant(calendarId: string, pin: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createServerClient();
    try {
        const { data: participant, error } = await supabase
            .from('participants')
            .select('id')
            .eq('calendar_id', calendarId)
            .eq('guest_pin', pin)
            .single();

        if (participant) {
            return { success: true };
        } else {
            return { success: false, error: "잘못된 입장 코드입니다." };
        }
    } catch (e) {
        console.error("Error logging in guest:", e);
        return { success: false, error: "로그인 중 오류가 발생했습니다." };
    }
}

export async function deleteParticipant(participantId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();


    if (!user) {
        return { success: false, error: "로그인이 필요합니다." };
    }

    try {
        const { data: participant, error: findError } = await supabase
            .from('participants')
            .select(`
                *,
                calendar:calendars (*)
            `)
            .eq('id', participantId)
            .single();

        if (findError || !participant) {
            return { success: false, error: "참여자를 찾을 수 없습니다." };
        }

        // Check if user is host
        // Suppress TS error for now if types aren't inferred perfectly
        const calendar = participant.calendar as any;
        if (calendar.host_id !== user.id) {
            return { success: false, error: "권한이 없습니다." };
        }

        const { error: deleteError } = await supabase
            .from('participants')
            .delete()
            .eq('id', participantId);

        if (deleteError) throw new Error(deleteError.message);

        return { success: true };

    } catch (e) {
        console.error("Error deleting participant:", e);
        return { success: false, error: "참여자 삭제 중 오류가 발생했습니다." };
    }
}
