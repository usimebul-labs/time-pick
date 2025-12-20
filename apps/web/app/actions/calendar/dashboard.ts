"use server";

import { prisma } from "@repo/database";
import { User } from "@supabase/supabase-js";
import { DashboardEvent } from "./types";

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
