import { Metadata } from "next";
import StackClient from "./StackClient";
import { getCalendarWithParticipation, getConfirmedCalendarResult } from "@/app/actions/calendar/calendar-action";

type Props = {
    params: Promise<{ stack: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { stack } = await params;

    // stack: ['calendar', ':id', 'join' | 'results' | ...]
    if (stack[0] === 'calendar' && stack[1]) {
        const calendarId = stack[1];
        const action = stack[2];

        if (action === 'join') {
            const { calendar } = await getCalendarWithParticipation(calendarId);
            if (calendar) {
                return {
                    title: `[초대장] ${calendar.title}`,
                    description: calendar.description || "일정을 조율하기 위해 참여해주세요.",
                    openGraph: {
                        title: `[초대장] ${calendar.title}`,
                        description: calendar.description || "일정을 조율하기 위해 참여해주세요.",
                    }
                };
            }
        } else if (action === 'results') {
            const { data } = await getConfirmedCalendarResult(calendarId);
            if (data && data.calendar) {
                return {
                    title: `[확정] ${data.calendar.title}`,
                    description: "일정이 확정되었습니다. 결과를 확인하세요.",
                    openGraph: {
                        title: `[확정] ${data.calendar.title}`,
                        description: "일정이 확정되었습니다. 결과를 확인하세요.",
                    }
                };
            } else {
                // Fallback if not confirmed or error, try basic info
                const { calendar } = await getCalendarWithParticipation(calendarId);
                if (calendar) {
                    return {
                        title: calendar.title,
                        description: calendar.description || undefined,
                        openGraph: {
                            title: calendar.title,
                            description: calendar.description || undefined
                        }
                    };
                }
            }
        }
    }

    return {};
}

export default function Page() {
    return <StackClient />;
}
