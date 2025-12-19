"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@repo/database";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export type CreateCalendarState = {
    message?: string;
    error?: string;
    fieldErrors?: {
        title?: string[];
        startDate?: string[];
        endDate?: string[];
    };
    eventId?: string;
};

export async function createCalendar(prevState: CreateCalendarState, formData: FormData): Promise<CreateCalendarState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const scheduleType = formData.get("scheduleType") as "date" | "datetime";

    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const startHour = formData.get("startHour") ? Number(formData.get("startHour")) : null;
    const endHour = formData.get("endHour") ? Number(formData.get("endHour")) : null;

    const enabledDaysStr = formData.get("enabledDays") as string; // JSON string of string[]
    const deadlineStr = formData.get("deadline") as string;

    // Validation
    if (!title) {
        return { error: "제목을 입력해주세요." };
    }
    if (!startDateStr || !endDateStr) {
        return { error: "날짜 범위를 선택해주세요." };
    }

    try {
        // 1. Convert Dates
        // Prisma wants DateTime objects.
        // Inputs are YYYY-MM-DD
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // 2. Handle Time
        // Prisma Time type uses a Date object where only time part matters.
        let startTime: Date | null = null;
        let endTime: Date | null = null;

        if (scheduleType === 'datetime' && startHour !== null && endHour !== null) {
            // Construct arbitrary date with correct hours
            // Construct arbitrary date with correct hours
            startTime = new Date();
            startTime.setUTCHours(startHour, 0, 0, 0);

            endTime = new Date();
            endTime.setUTCHours(endHour, 0, 0, 0);
        }

        // 3. Handle Deadline
        // Input is YYYY-MM-DDTHH:mm
        let deadline: Date | null = null;
        if (deadlineStr) {
            deadline = new Date(deadlineStr);
        } else {
            // Default to endDate EOD
            deadline = new Date(endDateStr);
            deadline.setUTCHours(23, 59, 59, 999);
        }

        // 4. Handle Days
        // Enabled days: ["Sun", "Mon", ...]
        // DB stores Excluded days (Int[]): Sun=0, ... Sat=6
        const enabledDays = JSON.parse(enabledDaysStr) as string[];
        const dayMap: Record<string, number> = {
            "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6
        };
        const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const excludedDays = allDays
            .filter(day => !enabledDays.includes(day))
            .map(day => dayMap[day])
            .filter((d): d is number => d !== undefined);

        // 5. Host ID logic
        // We need to map Supabase User ID to our Profile ID if possible, 
        // or if we use UUID for both, just use it.
        // The schema says Event.hostId references Profile.id.
        // We must ensure a Profile exists for this user.
        let hostId: string | null = null;

        if (user) {
            // Find or create profile
            // This logic might be better in a separate service, but for now:
            const profile = await prisma.profile.upsert({
                where: { id: user.id }, // Assuming Supabase ID matches Profile ID (it should)
                update: {},
                create: {
                    id: user.id,
                    email: user.email,
                    fullName: user.user_metadata.full_name,
                    avatarUrl: user.user_metadata.avatar_url
                }
            });
            hostId = profile.id;
        }

        // 6. Create Event
        const event = await prisma.event.create({
            data: {
                host: hostId ? { connect: { id: hostId } } : undefined,
                title,
                description,
                type: scheduleType === 'date' ? 'monthly' : 'weekly',
                startDate,
                endDate,
                startTime,
                endTime,
                excludedDays,
                deadline
            }
        });

        revalidatePath('/app/dashboard');
        return { message: "Success", eventId: event.id };

    } catch (e) {
        console.error(e);
        return { error: "일정 생성 중 오류가 발생했습니다." };
    }
}

export type DashboardEvent = {
    id: string;
    title: string;
    deadline: string | null;
    isConfirmed: boolean;
    participants: {
        name: string;
        avatarUrl: string | null;
        userId: string | null;
    }[];
};

export async function getMySchedules(user: User): Promise<{ schedules: DashboardEvent[]; error?: string; }> {

    if (!user) return { schedules: [] };
    try {

        const myEvents = await prisma.event.findMany({
            where: {
                hostId: user.id
            },

            include: {
                participants: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const schedules: DashboardEvent[] = myEvents.map(event => ({
            id: event.id,
            title: event.title,
            deadline: (event.deadline ? event.deadline.toISOString().split('T')[0] : null) as string | null,
            isConfirmed: event.isConfirmed,
            participants: event.participants.map(p => ({
                name: p.name,
                avatarUrl: p.user?.avatarUrl || null,
                userId: p.userId
            }))
        }));

        return { schedules };

    } catch (e) {
        console.error("Error fetching my schedules:", e);
        return { schedules: [], error: "내 일정을 불러오는 중 오류가 발생했습니다." };
    }
}

export async function getJoinedSchedules(user: User): Promise<{ schedules: DashboardEvent[]; error?: string; }> {
    try {
        const participations = await prisma.participant.findMany({
            where: {
                userId: user.id,
                event: {
                    hostId: {
                        not: user.id
                    }
                }
            },
            include: {
                event: {
                    include: {
                        participants: {
                            include: {
                                user: true
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const schedules: DashboardEvent[] = participations.map(p => ({
            id: p.event.id,
            title: p.event.title,
            deadline: (p.event.deadline ? p.event.deadline.toISOString().split('T')[0] : null) as string | null,
            isConfirmed: p.event.isConfirmed,
            participants: p.event.participants.map(ep => ({
                name: ep.name,
                avatarUrl: ep.user?.avatarUrl || null,
                userId: ep.userId
            }))
        }));

        return { schedules };
    } catch (e) {
        console.error("Error fetching joined schedules:", e);
        return { schedules: [], error: "참여한 일정을 불러오는 중 오류가 발생했습니다." };
    }
}



export type EventDetail = {
    id: string;
    title: string;
    description: string | null;
    type: "monthly" | "weekly";
    startDate: string;
    endDate: string;
    startTime: string | null;
    endTime: string | null;
    excludedDays: number[];
    deadline: string | null;
    hostId: string | null;
    hostName: string | null;
    hostAvatarUrl: string | null;
    isConfirmed: boolean;
};

export type ParticipantDetail = {
    id: string;
    name: string;
    availabilities: string[]; // Store slots as ISO strings
};

export type ParticipantSummary = {
    id: string;
    name: string;
    avatarUrl: string | null;
    isGuest: boolean;
    availabilities: string[];
    email?: string | null;
    createdAt: string;
};

export async function getEventWithParticipation(eventId: string, guestPin?: string): Promise<{
    event: EventDetail | null;
    participation: ParticipantDetail | null;
    participants: ParticipantSummary[];
    isLoggedIn: boolean;
    error?: string;
}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { host: true }
        });

        if (!event) {
            return { event: null, participation: null, participants: [], isLoggedIn: !!user, error: "일정을 찾을 수 없습니다." };
        }

        let participation: ParticipantDetail | null = null;

        // 1. Try User Login
        if (user) {
            const p = await prisma.participant.findUnique({
                where: {
                    eventId_userId: {
                        eventId: eventId,
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
                    eventId: eventId,
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
            where: { eventId: eventId },
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
            event: {
                id: event.id,
                title: event.title,
                description: event.description,
                type: event.type,
                startDate: event.startDate.toISOString().split('T')[0]!,
                endDate: event.endDate.toISOString().split('T')[0]!,
                startTime: event.startTime ? event.startTime.toISOString().split('T')[1]!.substring(0, 5) : null,
                endTime: event.endTime ? event.endTime.toISOString().split('T')[1]!.substring(0, 5) : null,
                excludedDays: event.excludedDays,
                deadline: event.deadline ? event.deadline.toISOString() : null,
                hostId: event.hostId,
                hostName: event.host?.fullName || null,
                hostAvatarUrl: event.host?.avatarUrl || null,
                isConfirmed: event.isConfirmed
            },
            participation,
            participants,
            isLoggedIn: !!user
        };

    } catch (e) {
        console.error("Error fetching event details:", e);
        return { event: null, participation: null, participants: [], isLoggedIn: false, error: "상세 정보를 불러오는 중 오류가 발생했습니다." };
    }
}

export async function joinSchedule(
    eventId: string,
    selectedSlots: string[], // ISO strings
    guestInfo?: { name?: string; pin?: string }
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
        let participantId: string;

        if (user) {
            // 1. User is logged in
            // Find or create participant linked to user
            const existing = await prisma.participant.findUnique({
                where: {
                    eventId_userId: {
                        eventId,
                        userId: user.id
                    }
                }
            });

            if (existing) {
                participantId = existing.id;
            } else {
                // Ensure profile exists
                await prisma.profile.upsert({
                    where: { id: user.id },
                    update: {},
                    create: {
                        id: user.id,
                        email: user.email,
                        fullName: user.user_metadata.full_name,
                        avatarUrl: user.user_metadata.avatar_url
                    }
                });

                const newParticipant = await prisma.participant.create({
                    data: {
                        eventId,
                        userId: user.id,
                        name: user.user_metadata.full_name || "익명",
                    }
                });
                participantId = newParticipant.id;
            }
        } else {
            // 2. Guest User
            if (guestInfo?.pin) {
                // Try to find existing guest by PIN
                const existing = await prisma.participant.findFirst({
                    where: {
                        eventId,
                        guestPin: guestInfo.pin
                    }
                });

                if (existing) {
                    participantId = existing.id;
                } else {
                    return { success: false, error: "유효하지 않은 게스트 PIN입니다." };
                }
            } else if (guestInfo?.name) {
                // Legacy support or if we want to allow name-only creation (though we force login now)
                // Create new guest participant
                const newParticipant = await prisma.participant.create({
                    data: {
                        eventId,
                        name: guestInfo.name,
                        guestPin: guestInfo.pin // Optional
                    }
                });
                participantId = newParticipant.id;
            } else {
                return { success: false, error: "게스트 정보가 필요합니다." };
            }
        }

        // 3. Save Availability
        // Transaction to replace all availabilities
        await prisma.$transaction(async (tx) => {
            // Delete existing
            await tx.availability.deleteMany({
                where: { participantId }
            });

            // Create new
            if (selectedSlots.length > 0) {
                await tx.availability.createMany({
                    data: selectedSlots.map(slot => ({
                        eventId,
                        participantId,
                        slot: new Date(slot)
                    }))
                });
            }
        });

        revalidatePath('/app/dashboard');
        revalidatePath(`/app/calendar/${eventId}`);
        return { success: true };

    } catch (e) {
        console.error("Error joining schedule:", e);
        return { success: false, error: "일정 등록 중 오류가 발생했습니다." };
    }
}

export async function createGuestParticipant(eventId: string, name: string): Promise<{ success: boolean; pin?: string; error?: string }> {
    try {
        // Generate 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.participant.create({
            data: {
                eventId,
                name,
                guestPin: pin
            }
        });

        return { success: true, pin };
    } catch (e) {
        console.error("Error creating guest:", e);
        return { success: false, error: "게스트 생성 중 오류가 발생했습니다." };
    }
}

export async function loginGuestParticipant(eventId: string, pin: string): Promise<{ success: boolean; error?: string }> {
    try {
        const participant = await prisma.participant.findFirst({
            where: {
                eventId,
                guestPin: pin
            }
        });

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "로그인이 필요합니다." };
    }

    try {
        const participant = await prisma.participant.findUnique({
            where: { id: participantId },
            include: { event: true }
        });

        if (!participant) {
            return { success: false, error: "참여자를 찾을 수 없습니다." };
        }

        if (participant.event.hostId !== user.id) {
            return { success: false, error: "권한이 없습니다." };
        }

        await prisma.participant.delete({
            where: { id: participantId }
        });

        revalidatePath(`/app/calendar/${participant.eventId}`);
        revalidatePath('/app/dashboard');
        return { success: true };

    } catch (e) {
        console.error("Error deleting participant:", e);
        return { success: false, error: "참여자 삭제 중 오류가 발생했습니다." };
    }
}

export async function deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "로그인이 필요합니다." };
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return { success: false, error: "일정을 찾을 수 없습니다." };
        }

        if (event.hostId !== user.id) {
            return { success: false, error: "권한이 없습니다." };
        }

        await prisma.event.delete({
            where: { id: eventId }
        });

        revalidatePath('/app/dashboard');
        return { success: true };
    } catch (e) {
        console.error("Error deleting event:", e);
        return { success: false, error: "일정 삭제 중 오류가 발생했습니다." };
    }
}


export type UpdateEventState = {
    success?: boolean;
    error?: string;
    conflictedParticipants?: { id: string; name: string }[];
    requiresConfirmation?: boolean;
};

export async function updateEvent(
    eventId: string,
    formData: FormData,
    confirmDelete: boolean = false
): Promise<UpdateEventState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "로그인이 필요합니다." };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const startHour = formData.get("startHour") ? Number(formData.get("startHour")) : null;
    const endHour = formData.get("endHour") ? Number(formData.get("endHour")) : null;

    const enabledDaysStr = formData.get("enabledDays") as string;
    const deadlineStr = formData.get("deadline") as string;

    if (!title || !startDateStr || !endDateStr) {
        return { error: "필수 정보를 입력해주세요." };
    }

    try {
        const oldEvent = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                participants: {
                    include: { availabilities: true }
                }
            }
        });

        if (!oldEvent) return { error: "일정을 찾을 수 없습니다." };
        if (oldEvent.hostId !== user.id) return { error: "권한이 없습니다." };

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        let startTime: Date | null = null;
        let endTime: Date | null = null;

        if (oldEvent.type === 'weekly' && startHour !== null && endHour !== null) {
            if (oldEvent.type === 'weekly') {
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

        const conflictedParticipants = new Set<string>();

        for (const p of oldEvent.participants) {
            let isValid = true;
            if (p.availabilities.length === 0) continue;

            for (const a of p.availabilities) {
                const slotDate = a.slot;

                const sDate = new Date(startDateStr); sDate.setHours(0, 0, 0, 0);
                const eDate = new Date(endDateStr); eDate.setHours(23, 59, 59, 999);
                const checkDate = new Date(slotDate); checkDate.setHours(0, 0, 0, 0);

                if (checkDate < sDate || checkDate > eDate) {
                    isValid = false; break;
                }

                const day = slotDate.getDay();
                if (excludedDays.includes(day)) {
                    isValid = false; break;
                }

                if (oldEvent.type === 'weekly' && startHour !== null && endHour !== null) {
                    const hour = slotDate.getHours();
                    if (hour < startHour || hour >= endHour) {
                        isValid = false; break;
                    }
                }
            }

            if (!isValid) {
                conflictedParticipants.add(p.id);
            }
        }

        const conflictedList = oldEvent.participants
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
            await tx.event.update({
                where: { id: eventId },
                data: {
                    title,
                    description,
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                    excludedDays,
                    deadline
                }
            });

            if (conflictedList.length > 0) {
                await tx.availability.deleteMany({
                    where: {
                        participantId: { in: conflictedList.map(p => p.id) }
                    }
                });
            }
        });

        revalidatePath(`/app/dashboard`);
        revalidatePath(`/app/calendar/${eventId}`);
        return { success: true };

    } catch (e) {
        console.error("Error updating event:", e);
        return { error: "일정 수정 중 오류가 발생했습니다." };
    }
}
export type ConfirmEventState = {
    success?: boolean;
    error?: string;
};

export async function confirmEvent(
    eventId: string,
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
): Promise<ConfirmEventState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "로그인이 필요합니다." };
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) return { error: "일정을 찾을 수 없습니다." };
        if (event.hostId !== user.id) return { error: "권한이 없습니다." };

        const start = new Date(finalSlot.startTime);
        let end = finalSlot.endTime ? new Date(finalSlot.endTime) : null;

        // Monthly Event logic: If no specific time provided (just date), verify if we need to set default logic
        if (event.type === 'monthly') {
            // If caller passed only Date part (no specific time selected by user logic?), 
            // but `finalSlot.startTime` should normally include time if `selectedTime` was combined.
            // If validation needed:
            // The requirement says: "If time info not entered for monthly... set start to day start, end to day end"
            // In `useConfirm`, we combine date + time. 
            // IF `useConfirm` passed a time-less ISO (e.g. just YYYY-MM-DDT00:00:00.000Z due to some logic), we treat it here?
            // Actually `useConfirm` guarantees `selectedTime` default "12:00". 
            // BUT, if we want to be safe or if the unique requirement implies "If user didn't pick time" (checking if explicit time set?)...
            // Let's assume if endTime is missing for Monthly, we set it to end of day of the start date.

            if (!end) {
                end = new Date(start);
                end.setHours(23, 59, 59, 999);

                // Also ensure start is at 00:00:00 if it was meant to be "Whole Day" or "Date Only"
                // But current UI forces a time selection. 
                // The prompt says: "When monthly calendar... if time info NOT entered...".
                // Detailed implementation: We'll ensure `end` is set.
            }
        } else {
            // Weekly
            if (!end) {
                // Should not happen for weekly, but safe fallback?
                end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
            }
        }

        // Transaction: Update Event status AND Create Confirmation
        await prisma.$transaction(async (tx) => {
            // 1. Update Event
            await tx.event.update({
                where: { id: eventId },
                data: {
                    isConfirmed: true,
                    // We DO NOT overwrite startDate/endDate of the original proposal
                }
            });

            // 2. Upsert Confirmation (in case of re-confirm?)
            // Schema has 1-1 relation. 
            await tx.eventConfirmation.upsert({
                where: { eventId: eventId },
                create: {
                    eventId: eventId,
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
        revalidatePath(`/app/calendar/${eventId}`);
        revalidatePath(`/app/calendar/${eventId}/confirm`);

        return { success: true };

    } catch (e) {
        console.error("Error confirming event:", e);
        return { error: "일정 확정 중 오류가 발생했습니다." };
    }
}

export type ConfirmedEventResult = {
    event: {
        id: string;
        title: string;
        description: string | null;
    };
    confirmation: {
        startAt: string; // ISO
        endAt: string;   // ISO
        message: {
            location?: string;
            transport?: string;
            parking?: string;
            fee?: string;
            bank?: string;
            inquiry?: string;
            memo?: string;
        } | null;
    };
    participants: ParticipantSummary[]; // Only those in confirmation.participantIds
};

export async function getConfirmedEventResult(eventId: string): Promise<{
    data: ConfirmedEventResult | null;
    error?: string;
}> {
    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                confirmation: true,
                participants: {
                    include: { user: true, availabilities: true } // Need user info for avatar
                }
            }
        });

        if (!event) return { data: null, error: "일정을 찾을 수 없습니다." };
        if (!event.isConfirmed || !event.confirmation) {
            return { data: null, error: "아직 확정되지 않은 일정입니다." };
        }

        // Parse message
        let messageData = null;
        try {
            if (event.confirmation.message) {
                messageData = JSON.parse(event.confirmation.message);
            }
        } catch (e) {
            // fallback if raw string or error
            console.warn("Failed to parse confirmation message:", e);
        }

        // Filter participants
        const confirmedIds = new Set(event.confirmation.participantIds);
        const confirmedParticipants = event.participants
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
                event: {
                    id: event.id,
                    title: event.title,
                    description: event.description
                },
                confirmation: {
                    startAt: event.confirmation.startAt.toISOString(),
                    endAt: event.confirmation.endAt.toISOString(),
                    message: messageData
                },
                participants: confirmedParticipants
            }
        };

    } catch (e) {
        console.error("Error fetching confirmed event result:", e);
        return { data: null, error: "확정 정보를 불러오는 중 오류가 발생했습니다." };
    }
}
