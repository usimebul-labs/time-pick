"use server";

import { createClient } from "@/common/lib/supabase/server";
import { prisma } from "@repo/database";
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
    const supabase = await createClient();
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

        let startTime: Date | null = null;
        let endTime: Date | null = null;

        if (calendarType === 'datetime' && startHour !== null && endHour !== null) {
            startTime = new Date();
            startTime.setUTCHours(startHour, 0, 0, 0);

            endTime = new Date();
            endTime.setUTCHours(endHour, 0, 0, 0);
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



        // Use Supabase JS directly instead of Prisma
        const { data: calendar, error: createError } = await supabase
            .from('calendars')
            .insert({
                host_id: hostId,
                title,
                description,
                event_type: calendarType === 'date' ? 'monthly' : 'weekly',
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                start_time: startTime ? startTime.toISOString() : null,
                end_time: endTime ? endTime.toISOString() : null,
                excluded_days: excludedDays,
                exclude_holidays: excludeHolidays,
                excluded_dates: excludedDates,
                deadline: deadline ? deadline.toISOString() : null
                // is_confirmed default false
                // created_at default now()
            })
            .select('id')
            .single();

        if (createError) {
            console.error("Error creating calendar with Supabase:", createError);
            return { error: "일정 생성 중 오류가 발생했습니다." };
        }

        revalidatePath('/app/dashboard');
        return { message: "Success", calendarId: calendar.id };

    } catch (e) {
        console.error(e);
        return { error: "일정 생성 중 오류가 발생했습니다." };
    }
}

export async function getCalendarWithParticipation(calendarId: string, guestPin?: string): Promise<GetCalendarWithParticipationState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
        const calendar = await prisma.calendar.findUnique({
            where: { id: calendarId },
            include: { host: true }
        });

        if (!calendar)
            return { calendar: null, participation: null, participants: [], isLoggedIn: !!user, error: "일정을 찾을 수 없습니다." };


        let participation: ParticipantDetail | null = null;

        // 1. Try User Login
        if (user) {
            const p = await prisma.participant.findUnique({
                where: {
                    calendarId_userId: {
                        calendarId: calendarId,
                        userId: user.id
                    }
                },
                include: {
                    availabilities: true
                }
            });

            if (p) {
                participation = {
                    id: p.id,
                    name: p.name,
                    availabilities: p.availabilities.map(a => a.slot.toISOString())
                };
            }
        }

        // 2. Try Guest Login (if not found as user)
        if (!participation && guestPin) {
            const p = await prisma.participant.findFirst({
                where: {
                    calendarId: calendarId,
                    guestPin: guestPin
                },
                include: {
                    availabilities: true
                }
            });

            if (p) {
                participation = {
                    id: p.id,
                    name: p.name,
                    availabilities: p.availabilities.map(a => a.slot.toISOString())
                };
            }
        }

        const allParticipants = await prisma.participant.findMany({
            where: { calendarId: calendarId },
            include: {
                user: true,
                availabilities: true
            }
        });

        const participants: ParticipantSummary[] = allParticipants.map(p => ({
            id: p.id,
            name: p.name,
            avatarUrl: p.user?.avatarUrl || null,
            isGuest: !p.userId,
            availabilities: p.availabilities.map(a => a.slot.toISOString()),
            email: p.user?.email,
            createdAt: p.createdAt.toISOString()
        }));

        return {
            calendar: {
                id: calendar.id,
                title: calendar.title,
                description: calendar.description,
                type: calendar.type,
                startDate: calendar.startDate.toISOString().split('T')[0]!,
                endDate: calendar.endDate.toISOString().split('T')[0]!,
                startTime: calendar.startTime ? calendar.startTime.toISOString().split('T')[1]!.substring(0, 5) : null,
                endTime: calendar.endTime ? calendar.endTime.toISOString().split('T')[1]!.substring(0, 5) : null,
                excludedDays: calendar.excludedDays,
                excludeHolidays: calendar.excludeHolidays,
                excludedDates: calendar.excludedDates,
                deadline: calendar.deadline ? calendar.deadline.toISOString() : null,
                hostId: calendar.hostId,
                hostName: calendar.host?.fullName || null,
                hostAvatarUrl: calendar.host?.avatarUrl || null,
                isConfirmed: calendar.isConfirmed
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "로그인 후 이용해주세요." }

    try {
        const calendar = await prisma.calendar.findUnique({
            where: { id: calendarId }
        });

        if (!calendar) return { success: false, error: "일정을 찾을 수 없습니다." };

        if (calendar.hostId !== user.id) return { success: false, error: "권한이 없습니다." };


        await prisma.calendar.delete({
            where: { id: calendarId }
        });

        revalidatePath('/app/dashboard');
        return { success: true };
    } catch (e) {
        console.error("Error deleting calendar:", e);
        return { success: false, error: "일정 삭제 중 오류가 발생했습니다." };
    }
}

export async function updateCalendar(calendarId: string, formData: FormData, confirmDelete: boolean = false): Promise<UpdateCalendarState> {
    const supabase = await createClient();
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
        const oldCalendar = await prisma.calendar.findUnique({
            where: { id: calendarId },
            include: {
                participants: {
                    include: { availabilities: true }
                }
            }
        });

        if (!oldCalendar) return { error: "일정을 찾을 수 없습니다." };
        if (oldCalendar.hostId !== user.id) return { error: "권한이 없습니다." };

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        let startTime: Date | null = null;
        let endTime: Date | null = null;

        if (oldCalendar.type === 'weekly' && startHour !== null && endHour !== null) {
            if (oldCalendar.type === 'weekly') {
                startTime = new Date();
                startTime.setUTCHours(startHour, 0, 0, 0);
                endTime = new Date();
                endTime.setUTCHours(endHour, 0, 0, 0);
            }
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
        const invalidAvailabilityIds: bigint[] = [];

        for (const p of oldCalendar.participants) {
            if (p.availabilities.length === 0) continue;

            for (const a of p.availabilities) {
                let isSlotValid = true;
                const slotDate = a.slot;

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

                if (isSlotValid && oldCalendar.type === 'weekly' && startHour !== null && endHour !== null) {
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

        const conflictedList = oldCalendar.participants
            .filter(p => conflictedParticipants.has(p.id))
            .map(p => ({ id: p.id, name: p.name }));

        if (conflictedList.length > 0 && !confirmDelete) {
            return {
                requiresConfirmation: true,
                conflictedParticipants: conflictedList,
                error: "일정 변경으로 인해 일부 참여자의 가능한 시간이 유효하지 않게 됩니다."
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.calendar.update({
                where: { id: calendarId },
                data: {
                    title,
                    description,
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                    excludedDays,
                    excludeHolidays,
                    excludedDates,
                    deadline
                }
            });

            if (invalidAvailabilityIds.length > 0) {
                await tx.availability.deleteMany({
                    where: {
                        id: { in: invalidAvailabilityIds }
                    }
                });
            }
        });

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "로그인이 필요합니다." };


    try {
        const calendar = await prisma.calendar.findUnique({
            where: { id: calendarId }
        });

        if (!calendar) return { error: "일정을 찾을 수 없습니다." };
        if (calendar.hostId !== user.id) return { error: "권한이 없습니다." };

        const start = new Date(finalSlot.startTime);
        let end = finalSlot.endTime ? new Date(finalSlot.endTime) : null;

        if (calendar.type === 'monthly') {
            if (!end) {
                end = new Date(start);
                end.setHours(23, 59, 59, 999);
            }
        } else {
            if (!end) {
                end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
            }
        }

        await prisma.$transaction(async (tx) => {
            await tx.calendar.update({
                where: { id: calendarId },
                data: {
                    isConfirmed: true,
                }
            });

            await tx.event.upsert({
                where: { calendarId: calendarId },
                create: {
                    calendarId: calendarId,
                    startAt: start,
                    endAt: end!,
                    message: JSON.stringify(additionalInfo),
                    participantIds: participantIds
                },
                update: {
                    startAt: start,
                    endAt: end!,
                    message: JSON.stringify(additionalInfo),
                    participantIds: participantIds
                }
            });
        });

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
        const calendar = await prisma.calendar.findUnique({
            where: { id: calendarId },
            include: {
                event: true,
                participants: {
                    include: { user: true, availabilities: true } // Need user info for avatar
                }
            }
        });

        if (!calendar) return { data: null, error: "일정을 찾을 수 없습니다." };
        if (!calendar.isConfirmed || !calendar.event) {
            return { data: null, error: "아직 확정되지 않은 일정입니다." };
        }

        // Parse message
        let messageData = null;
        try {
            if (calendar.event.message) {
                messageData = JSON.parse(calendar.event.message);
            }
        } catch (e) {
            // fallback if raw string or error
            console.warn("Failed to parse confirmation message:", e);
        }

        // Filter participants
        const confirmedIds = new Set(calendar.event.participantIds);
        const confirmedParticipants = calendar.participants
            .filter(p => confirmedIds.has(p.id))
            .map(p => ({
                id: p.id,
                name: p.name,
                avatarUrl: p.user?.avatarUrl || null,
                isGuest: !p.userId,
                availabilities: p.availabilities.map(a => a.slot.toISOString()),
                email: p.user?.email,
                createdAt: p.createdAt.toISOString()
            }));

        return {
            data: {
                calendar: {
                    id: calendar.id,
                    title: calendar.title,
                    description: calendar.description
                },
                event: {
                    startAt: calendar.event.startAt.toISOString(),
                    endAt: calendar.event.endAt.toISOString(),
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
