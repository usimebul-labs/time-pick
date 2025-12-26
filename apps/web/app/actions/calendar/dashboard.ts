"use server";

import { prisma } from "@repo/database";
import { User } from "@supabase/supabase-js";
import { DashboardCalendar } from "./types";

export async function getCalendars(user: User): Promise<{ calendars: DashboardCalendar[]; error?: string; }> {
    if (!user) return { calendars: [] };

    try {
        const participations = await prisma.participant.findMany({
            where: {
                userId: user.id
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
                calendar: {
                    createdAt: 'desc'
                }
            }
        });

        const calendars: DashboardCalendar[] = participations.map(p => {
            const c = p.calendar;
            const isHost = c.hostId === user.id;
            const isConfirmed = c.isConfirmed;

            let type: 'created' | 'joined' | 'confirmed' = 'joined';
            if (isConfirmed) {
                type = 'confirmed';
            } else if (isHost) {
                type = 'created';
            }

            return {
                id: c.id,
                title: c.title,
                startDate: c.startDate.toISOString().split('T')[0]!,
                endDate: c.endDate.toISOString().split('T')[0]!,
                deadline: (c.deadline ? c.deadline.toISOString().split('T')[0] : null) as string | null,
                isConfirmed,
                isHost,
                createdAt: c.createdAt.toISOString(),
                participants: c.participants.map(ep => ({
                    name: ep.name,
                    avatarUrl: ep.user?.avatarUrl || null,
                    userId: ep.userId
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
