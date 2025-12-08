"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@repo/database";
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
            startTime = new Date();
            startTime.setHours(startHour, 0, 0, 0);

            endTime = new Date();
            endTime.setHours(endHour, 0, 0, 0);
        }

        // 3. Handle Deadline
        // Input is YYYY-MM-DDTHH:mm
        let deadline: Date | null = null;
        if (deadlineStr) {
            deadline = new Date(deadlineStr);
        } else {
            // Default to endDate EOD
            deadline = new Date(endDateStr);
            deadline.setHours(23, 59, 59, 999);
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

export type DashboardSchedule = {
    id: string;
    title: string;
    deadline: string | null;
    participantCount: number;
    isConfirmed: boolean;
};

export async function getUserSchedules(): Promise<{
    mySchedules: DashboardSchedule[];
    joinedSchedules: DashboardSchedule[];
    error?: string;
}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { mySchedules: [], joinedSchedules: [] };
    }

    try {
        // 1. Get My Schedules (Hosted by me)
        // We need to find the profile ID first to be safe, 
        // OR we just assume hostId is the user.id since we force that in createCalendar.
        // Let's use user.id directly for hostId based on createCalendar logic.

        const myEvents = await prisma.event.findMany({
            where: {
                hostId: user.id
            },
            include: {
                _count: {
                    select: { participants: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const mySchedules: DashboardSchedule[] = myEvents.map(event => ({
            id: event.id,
            title: event.title,
            deadline: (event.deadline ? event.deadline.toISOString().split('T')[0] : null) as string | null,
            participantCount: event._count.participants,
            isConfirmed: event.isConfirmed
        }));

        // 2. Get Joined Schedules
        // Where I am a participant
        const participations = await prisma.participant.findMany({
            where: {
                userId: user.id
            },
            include: {
                event: {
                    include: {
                        _count: {
                            select: { participants: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const joinedSchedules: DashboardSchedule[] = participations.map(p => ({
            id: p.event.id,
            title: p.event.title,
            deadline: (p.event.deadline ? p.event.deadline.toISOString().split('T')[0] : null) as string | null,
            participantCount: p.event._count.participants,
            isConfirmed: p.event.isConfirmed
        }));

        return { mySchedules, joinedSchedules };

    } catch (e) {
        console.error("Error fetching schedules:", e);
        return { mySchedules: [], joinedSchedules: [], error: "일정을 불러오는 중 오류가 발생했습니다." };
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
};

export async function getEventWithParticipation(eventId: string): Promise<{
    event: EventDetail | null;
    participation: ParticipantDetail | null;
    participants: ParticipantSummary[];
    error?: string;
}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return { event: null, participation: null, participants: [], error: "일정을 찾을 수 없습니다." };
        }

        let participation: ParticipantDetail | null = null;
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
            availabilities: p.availabilities.map(a => a.slot.toISOString())
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
                isConfirmed: event.isConfirmed
            },
            participation,
            participants
        };

    } catch (e) {
        console.error("Error fetching event details:", e);
        return { event: null, participation: null, participants: [], error: "상세 정보를 불러오는 중 오류가 발생했습니다." };
    }
}

export async function joinSchedule(
    eventId: string,
    selectedSlots: string[], // ISO strings
    guestInfo?: { name: string; pin?: string }
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
                // Ensure profile exists (should already exist if logged in, but safe to upsert)
                // Actually, if we just use user.id, we rely on profile existing or foreign key might fail if we enforce it.
                // In createCalendar we upserted profile. Let's do it here too to be safe.
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
            if (!guestInfo || !guestInfo.name) {
                return { success: false, error: "게스트 이름이 필요합니다." };
            }

            // Create guest participant
            // Note: Guest participants might be duplicates if we don't have a way to identify them.
            // For now, we always create a new guest participant or we could check name+pin?
            // Let's assume for now guests are unique per session or we just create new.
            // But if they want to edit? We need a way to find them.
            // For MVP, simple create.
            const newParticipant = await prisma.participant.create({
                data: {
                    eventId,
                    name: guestInfo.name,
                    guestPin: guestInfo.pin
                }
            });
            participantId = newParticipant.id;
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
