"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";

export async function joinSchedule(
    calendarId: string,
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
                    calendarId_userId: {
                        calendarId,
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
                        calendarId,
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
                        calendarId,
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
                        calendarId,
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
                        calendarId,
                        participantId,
                        slot: new Date(slot)
                    }))
                });
            }
        });

        revalidatePath('/app/dashboard');
        revalidatePath(`/app/calendar/${calendarId}`);
        return { success: true };

    } catch (e) {
        console.error("Error joining schedule:", e);
        return { success: false, error: "일정 등록 중 오류가 발생했습니다." };
    }
}

export async function createGuestParticipant(calendarId: string, name: string): Promise<{ success: boolean; pin?: string; error?: string }> {
    try {
        // Generate 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.participant.create({
            data: {
                calendarId,
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

export async function loginGuestParticipant(calendarId: string, pin: string): Promise<{ success: boolean; error?: string }> {
    try {
        const participant = await prisma.participant.findFirst({
            where: {
                calendarId,
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
            include: { calendar: true }
        });

        if (!participant) {
            return { success: false, error: "참여자를 찾을 수 없습니다." };
        }

        if (participant.calendar.hostId !== user.id) {
            return { success: false, error: "권한이 없습니다." };
        }

        await prisma.participant.delete({
            where: { id: participantId }
        });

        revalidatePath(`/app/calendar/${participant.calendarId}`);
        revalidatePath('/app/dashboard');
        return { success: true };

    } catch (e) {
        console.error("Error deleting participant:", e);
        return { success: false, error: "참여자 삭제 중 오류가 발생했습니다." };
    }
}
