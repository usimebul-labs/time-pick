"use server";

import { prisma } from "@repo/database";
import { User } from "@supabase/supabase-js";
import { DashboardCalendar } from "./types";

export async function getMySchedules(user: User): Promise<{ schedules: DashboardCalendar[]; error?: string; }> {

    if (!user) return { schedules: [] };
    try {

        const myCalendars = await prisma.calendar.findMany({
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

        const schedules: DashboardCalendar[] = myCalendars.map(calendar => ({
            id: calendar.id,
            title: calendar.title,
            startDate: calendar.startDate.toISOString().split('T')[0]!,
            endDate: calendar.endDate.toISOString().split('T')[0]!,
            deadline: (calendar.deadline ? calendar.deadline.toISOString().split('T')[0] : null) as string | null,
            isConfirmed: calendar.isConfirmed,
            isHost: true,
            createdAt: calendar.createdAt.toISOString(),
            participants: calendar.participants.map(p => ({
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

export async function getJoinedSchedules(user: User): Promise<{ schedules: DashboardCalendar[]; error?: string; }> {
    try {
        const participations = await prisma.participant.findMany({
            where: {
                userId: user.id,
                calendar: {
                    hostId: {
                        not: user.id
                    }
                }
            },
            include: {
                calendar: {
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

        const schedules: DashboardCalendar[] = participations.map(p => ({
            id: p.calendar.id,
            title: p.calendar.title,
            startDate: p.calendar.startDate.toISOString().split('T')[0]!,
            endDate: p.calendar.endDate.toISOString().split('T')[0]!,
            deadline: (p.calendar.deadline ? p.calendar.deadline.toISOString().split('T')[0] : null) as string | null,
            isConfirmed: p.calendar.isConfirmed,
            isHost: false,
            createdAt: p.calendar.createdAt.toISOString(),
            participants: p.calendar.participants.map(ep => ({
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
