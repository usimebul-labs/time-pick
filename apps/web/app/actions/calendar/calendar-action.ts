"use server";

import { createServerClient } from "@repo/database";

import { revalidatePath } from "next/cache";
import {
    CreateCalendarState,
    GetCalendarWithParticipationState,
    ParticipantDetail,
    ParticipantSummary,
    UpdateCalendarState,
    ConfirmCalendarState,
    ConfirmedCalendarResult
} from "./types";

export async function createCalendar(prevState: CreateCalendarState, formData: FormData): Promise<CreateCalendarState> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "로그인 후 이용해주세요." }


    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const calendarType = formData.get("scheduleType") as "date" | "datetime";

    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const startHour = formData.get("startHour") ? Number(formData.get("startHour")) : null;
    const endHour = formData.get("endHour") ? Number(formData.get("endHour")) : null;

    const enabledDaysStr = formData.get("enabledDays") as string; // JSON string of string[]
    const excludeHolidays = formData.get("excludeHolidays") === "true";
    const excludedDatesStr = formData.get("excludedDates") as string; // JSON string of string[]
    const deadlineStr = formData.get("deadline") as string;

    if (!title) return { error: "제목을 입력해주세요." };
    if (!startDateStr || !endDateStr) return { error: "날짜 범위를 선택해주세요." };

    try {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        let startTime: string | null = null;
        let endTime: string | null = null;

        if (calendarType === 'datetime' && startHour !== null && endHour !== null) {
            // Format to HH:MM:00 for Supabase time column
            startTime = `${startHour.toString().padStart(2, '0')}:00:00`;
            endTime = `${endHour.toString().padStart(2, '0')}:00:00`;
        }

        let deadline: Date | null = null;
        if (deadlineStr) deadline = new Date(deadlineStr);


        const enabledDays = JSON.parse(enabledDaysStr) as string[];
        const dayMap: Record<string, number> = {
            "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6
        };
        const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const excludedDays = allDays
            .filter(day => !enabledDays.includes(day))
            .map(day => dayMap[day])
            .filter((d): d is number => d !== undefined);

        const excludedDates = excludedDatesStr ? JSON.parse(excludedDatesStr) as string[] : [];
        const hostId = user.id;

        const { data: calendar, error } = await supabase
            .from('calendars')
            .insert({
                host_id: hostId,
                title,
                description,
                event_type: calendarType === 'date' ? 'monthly' : 'weekly',
                start_date: startDate.toISOString(), // Postgres handles ISO for Date
                end_date: endDate.toISOString(),
                start_time: startTime,
                end_time: endTime,
                excluded_days: excludedDays,
                exclude_holidays: excludeHolidays,
                excluded_dates: excludedDates,
                deadline: deadline ? deadline.toISOString() : null
            })
            .select('id')
            .single();

        if (error) throw new Error(error.message);

        revalidatePath('/app/dashboard');
        return { message: "Success", calendarId: calendar.id };

    } catch (e) {
        console.error(e);
        return { error: "일정 생성 중 오류가 발생했습니다." };
    }
}

export async function getCalendarWithParticipation(calendarId: string, guestPin?: string): Promise<GetCalendarWithParticipationState> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();


    try {
        const { data: calendar, error: calendarError } = await supabase
            .from('calendars')
            .select(`
                *,
                host:profiles (*)
            `)
            .eq('id', calendarId)
            .single();

        if (calendarError || !calendar)
            return { calendar: null, participation: null, participants: [], isLoggedIn: !!user, error: "일정을 찾을 수 없습니다." };


        let participation: ParticipantDetail | null = null;

        // 1. Try User Login
        if (user) {
            const { data: p, error } = await supabase
                .from('participants')
                .select(`
                    *,
                    availabilities (*)
                `)
                .eq('calendar_id', calendarId)
                .eq('user_id', user.id)
                .single();

            if (p) {
                participation = {
                    id: p.id,
                    name: p.name,
                    availabilities: p.availabilities.map((a: any) => a.slot) // Supabase returns ISO string for timestamptz
                };
            }
        }

        // 2. Try Guest Login (if not found as user)
        if (!participation && guestPin) {
            const { data: p, error } = await supabase
                .from('participants')
                .select(`
                    *,
                    availabilities (*)
                `)
                .eq('calendar_id', calendarId)
                .eq('guest_pin', guestPin)
                .single();

            if (p) {
                participation = {
                    id: p.id,
                    name: p.name,
                    availabilities: p.availabilities.map((a: any) => a.slot)
                };
            }
        }

        const { data: allParticipantsData, error: participantsError } = await supabase
            .from('participants')
            .select(`
                *,
                user:profiles (*),
                availabilities (*)
            `)
            .eq('calendar_id', calendarId);

        const allParticipants = allParticipantsData || [];

        const participants: ParticipantSummary[] = allParticipants.map((p: any) => ({
            id: p.id,
            name: p.name,
            avatarUrl: p.user?.avatar_url || null,
            isGuest: !p.user_id,
            availabilities: p.availabilities.map((a: any) => a.slot),
            email: p.user?.email,
            createdAt: p.created_at
        }));

        return {
            calendar: {
                id: calendar.id,
                title: calendar.title,
                description: calendar.description,
                type: calendar.event_type,
                startDate: calendar.start_date, // YYYY-MM-DD
                endDate: calendar.end_date,
                startTime: calendar.start_time ? calendar.start_time.substring(0, 5) : null, // HH:MM:SS -> HH:MM
                endTime: calendar.end_time ? calendar.end_time.substring(0, 5) : null,
                excludedDays: calendar.excluded_days,
                excludeHolidays: calendar.exclude_holidays,
                excludedDates: calendar.excluded_dates,
                deadline: calendar.deadline ? calendar.deadline : null, // ISO string
                hostId: calendar.host_id,
                hostName: calendar.host?.full_name || null,
                hostAvatarUrl: calendar.host?.avatar_url || null,
                isConfirmed: calendar.is_confirmed
            },
            participation,
            participants,
            isLoggedIn: !!user
        };

    } catch (e) {
        console.error("Error fetching calendar details:", e);
        return { calendar: null, participation: null, participants: [], isLoggedIn: false, error: "상세 정보를 불러오는 중 오류가 발생했습니다." };
    }
}

export async function deleteCalendar(calendarId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();


    if (!user) return { success: false, error: "로그인 후 이용해주세요." }

    try {
        const { data: calendar, error: findError } = await supabase
            .from('calendars')
            .select('host_id')
            .eq('id', calendarId)
            .single();

        if (findError || !calendar) return { success: false, error: "일정을 찾을 수 없습니다." };

        if (calendar.host_id !== user.id) return { success: false, error: "권한이 없습니다." };


        const { error: deleteError } = await supabase
            .from('calendars')
            .delete()
            .eq('id', calendarId);

        if (deleteError) throw new Error(deleteError.message);

        revalidatePath('/app/dashboard');
        return { success: true };
    } catch (e) {
        console.error("Error deleting calendar:", e);
        return { success: false, error: "일정 삭제 중 오류가 발생했습니다." };
    }
}

export async function updateCalendar(calendarId: string, formData: FormData, confirmDelete: boolean = false): Promise<UpdateCalendarState> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();


    if (!user) return { error: "로그인 후 이용해주세요." }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const startHour = formData.get("startHour") ? Number(formData.get("startHour")) : null;
    const endHour = formData.get("endHour") ? Number(formData.get("endHour")) : null;

    const enabledDaysStr = formData.get("enabledDays") as string;
    const excludeHolidays = formData.get("excludeHolidays") === "true";
    const excludedDatesStr = formData.get("excludedDates") as string;
    const deadlineStr = formData.get("deadline") as string;

    if (!title || !startDateStr || !endDateStr)
        return { error: "필수 정보를 입력해주세요." };


    try {
        const { data: oldCalendar, error: fetchError } = await supabase
            .from('calendars')
            .select(`
                *,
                participants (
                    *,
                    availabilities (*)
                )
            `)
            .eq('id', calendarId)
            .single();

        if (fetchError || !oldCalendar) return { error: "일정을 찾을 수 없습니다." };
        if (oldCalendar.host_id !== user.id) return { error: "권한이 없습니다." };

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        let startTime: string | null = null;
        let endTime: string | null = null;

        // Use calendar type from DB or infer? Logic used oldCalendar.type in prisma code
        const calendarType = oldCalendar.event_type;

        if (calendarType === 'weekly' && startHour !== null && endHour !== null) {
            startTime = `${startHour.toString().padStart(2, '0')}:00:00`;
            endTime = `${endHour.toString().padStart(2, '0')}:00:00`;
        }

        let deadline: Date | null = null;
        if (deadlineStr) {
            deadline = new Date(deadlineStr);
        } else {
            deadline = new Date(endDateStr);
            deadline.setUTCHours(23, 59, 59, 999);
        }

        const enabledDays = JSON.parse(enabledDaysStr) as string[];
        const dayMap: Record<string, number> = {
            "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6
        };
        const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const excludedDays = allDays
            .filter(day => !enabledDays.includes(day))
            .map(day => dayMap[day])
            .filter((d): d is number => d !== undefined);

        const excludedDates = excludedDatesStr ? JSON.parse(excludedDatesStr) as string[] : [];

        const conflictedParticipants = new Set<string>();
        const invalidAvailabilityIds: number[] = []; // availabilities.id is BigInt in Prisma, check Supabase type? 
        // In schema.prisma it is BigInt. Supabase JS returns number (if safe) or string.
        // Assuming number/string for now.

        // Fix: availabilities is an array on participant
        const participants = oldCalendar.participants || [];
        for (const p of participants) {
            if (!p.availabilities || p.availabilities.length === 0) continue;

            for (const a of p.availabilities) {
                let isSlotValid = true;
                const slotDate = new Date(a.slot); // ISO string

                const sDate = new Date(startDateStr); sDate.setHours(0, 0, 0, 0);
                const eDate = new Date(endDateStr); eDate.setHours(23, 59, 59, 999);
                const checkDate = new Date(slotDate); checkDate.setHours(0, 0, 0, 0);

                if (checkDate < sDate || checkDate > eDate) {
                    isSlotValid = false;
                }

                if (isSlotValid) {
                    const day = slotDate.getDay();
                    if (excludedDays.includes(day)) {
                        isSlotValid = false;
                    }
                }

                if (isSlotValid && calendarType === 'weekly' && startHour !== null && endHour !== null) {
                    const hour = slotDate.getHours();
                    if (hour < startHour || hour >= endHour) {
                        isSlotValid = false;
                    }
                }

                if (!isSlotValid) {
                    conflictedParticipants.add(p.id);
                    invalidAvailabilityIds.push(a.id);
                }
            }
        }

        const conflictedList = participants
            .filter((p: any) => conflictedParticipants.has(p.id))
            .map((p: any) => ({ id: p.id, name: p.name }));

        if (conflictedList.length > 0 && !confirmDelete) {
            return {
                requiresConfirmation: true,
                conflictedParticipants: conflictedList,
                error: "일정 변경으로 인해 일부 참여자의 가능한 시간이 유효하지 않게 됩니다."
            };
        }

        // Sequential update
        const { error: updateError } = await supabase
            .from('calendars')
            .update({
                title,
                description,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                start_time: startTime,
                end_time: endTime,
                excluded_days: excludedDays,
                exclude_holidays: excludeHolidays,
                excluded_dates: excludedDates,
                deadline: deadline ? deadline.toISOString() : null
            })
            .eq('id', calendarId);

        if (updateError) throw new Error(updateError.message);

        if (invalidAvailabilityIds.length > 0) {
            const { error: deleteError } = await supabase
                .from('availabilities')
                .delete()
                .in('id', invalidAvailabilityIds);

            if (deleteError) throw new Error(deleteError.message);
        }

        revalidatePath(`/app/dashboard`);
        revalidatePath(`/app/calendar/${calendarId}`);
        return { success: true };

    } catch (e) {
        console.error("Error updating calendar:", e);
        return { error: "일정 수정 중 오류가 발생했습니다." };
    }
}

export async function confirmCalendar(
    calendarId: string,
    finalSlot: { startTime: string; endTime?: string },
    participantIds: string[],
    additionalInfo: {
        location: string;
        transport: string;
        parking: string;
        fee: string;
        bank: string;
        inquiry: string;
        memo: string;
    }
): Promise<ConfirmCalendarState> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();


    if (!user) return { error: "로그인이 필요합니다." };


    try {
        const { data: calendar, error: findError } = await supabase
            .from('calendars')
            .select('host_id, event_type')
            .eq('id', calendarId)
            .single();

        if (findError || !calendar) return { error: "일정을 찾을 수 없습니다." };
        if (calendar.host_id !== user.id) return { error: "권한이 없습니다." };

        const start = new Date(finalSlot.startTime);
        let end = finalSlot.endTime ? new Date(finalSlot.endTime) : null;

        if (calendar.event_type === 'monthly') {
            if (!end) {
                end = new Date(start);
                end.setHours(23, 59, 59, 999);
            }
        } else {
            if (!end) {
                end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
            }
        }

        // Sequential update
        const { error: updateError } = await supabase
            .from('calendars')
            .update({ is_confirmed: true })
            .eq('id', calendarId);

        if (updateError) throw new Error(updateError.message);

        // Upsert Event
        // In Supabase upsert, need to specify 'onConflict' if not PK? 
        // calendar_id is unique in events table, so it should work if we include it.
        const { error: eventError } = await supabase
            .from('events')
            .upsert({
                calendar_id: calendarId,
                start_at: start.toISOString(),
                end_at: end!.toISOString(),
                message: JSON.stringify(additionalInfo),
                participant_ids: participantIds
            }, { onConflict: 'calendar_id' });

        if (eventError) throw new Error(eventError.message);

        revalidatePath(`/app/dashboard`);
        revalidatePath(`/app/calendar/${calendarId}`);
        revalidatePath(`/app/calendar/${calendarId}/confirm`);

        return { success: true };

    } catch (e) {
        console.error("Error confirming calendar:", e);
        return { error: "일정 확정 중 오류가 발생했습니다." };
    }
}

export async function getConfirmedCalendarResult(calendarId: string): Promise<{
    data: ConfirmedCalendarResult | null;
    error?: string;
}> {
    try {
        const supabase = await createServerClient();
        const { data: calendar, error: findError } = await supabase
            .from('calendars')
            .select(`
                *,
                event:events (*),
                participants (
                    *,
                    user:profiles (*),
                    availabilities (*)
                )
            `)
            .eq('id', calendarId)
            .single();

        if (findError || !calendar) return { data: null, error: "일정을 찾을 수 없습니다." };

        // Check if event exists (Supabase might return null for single relation if missing? or empty array if hasMany?)
        // events is 1-to-1? defined as `event Event?` in prisma.
        // In fetching, if 1-to-1, it returns object or null.
        if (!calendar.is_confirmed || !calendar.event) {
            return { data: null, error: "아직 확정되지 않은 일정입니다." };
        }

        // Parse message
        let messageData = null;
        try {
            if (calendar.event.message) {
                messageData = JSON.parse(calendar.event.message);
            }
        } catch (e) {
            console.warn("Failed to parse confirmation message:", e);
        }

        // Filter participants
        // participant_ids in event is array of strings
        const confirmedIds = new Set(calendar.event.participant_ids || []);
        const confirmedParticipants = (calendar.participants || [])
            .filter((p: any) => confirmedIds.has(p.id))
            .map((p: any) => ({
                id: p.id,
                name: p.name,
                avatarUrl: p.user?.avatar_url || null,
                isGuest: !p.user_id,
                availabilities: p.availabilities.map((a: any) => a.slot),
                email: p.user?.email,
                createdAt: p.created_at
            }));

        return {
            data: {
                calendar: {
                    id: calendar.id,
                    title: calendar.title,
                    description: calendar.description
                },
                event: {
                    startAt: calendar.event.start_at, // ISO
                    endAt: calendar.event.end_at,
                    message: messageData
                },
                participants: confirmedParticipants
            }
        };

    } catch (e) {
        console.error("Error fetching confirmed calendar result:", e);
        return { data: null, error: "확정 정보를 불러오는 중 오류가 발생했습니다." };
    }
}
