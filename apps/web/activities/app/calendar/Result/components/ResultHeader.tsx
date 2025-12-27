import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ParticipantGrid } from "@/common/components/participant/ParticipantGrid";
import { ConfirmedCalendarResult } from "@/app/actions/calendar";
import { SharedParticipant } from "@/common/types/participant";

interface ResultHeaderProps {
    calendar: ConfirmedCalendarResult['calendar'];
    event: ConfirmedCalendarResult['event'];
    participants: ConfirmedCalendarResult['participants'];
}

export function ResultHeader({ calendar, event, participants }: ResultHeaderProps) {
    if (!calendar || !event) return null;

    const { startAt, endAt } = event;
    const sDate = new Date(startAt);
    const eDate = new Date(endAt);

    const isAllDay = sDate.getHours() === 0 && sDate.getMinutes() === 0 && eDate.getHours() === 23 && eDate.getMinutes() === 59;
    const isSameDay = sDate.getDate() === eDate.getDate() && sDate.getMonth() === eDate.getMonth();

    const dateStr = format(sDate, "yyyy년 M월 d일 EEEE", { locale: ko });
    let timeDisplay = "";

    if (isAllDay) {
        timeDisplay = "하루 종일";
    } else {
        const timeStr = format(sDate, "aaa h:mm", { locale: ko });
        const endTimeStr = format(eDate, "aaa h:mm", { locale: ko });
        if (isSameDay) {
            timeDisplay = `${timeStr} - ${endTimeStr}`;
        } else {
            const endDateStr = format(eDate, "M월 d일 (EEE)", { locale: ko });
            timeDisplay = `${timeStr} - ${endDateStr} ${endTimeStr}`;
        }
    }

    const sharedParticipants: SharedParticipant[] = participants.map(p => ({
        id: p.id,
        name: p.name,
        avatarUrl: p.avatarUrl,
        userId: p.isGuest ? null : "user",
        email: p.email,
        createdAt: p.createdAt,
        isGuest: p.isGuest
    }));

    return (
        <div className="px-6 pt-8 pb-6">
            <h1 className="text-xl font-bold text-slate-900 leading-tight mb-3">
                {calendar.title}
            </h1>
            <div className="mb-4">
                <div className="text-base font-bold text-slate-900">{dateStr}</div>
                {!isAllDay && <div className="text-sm text-slate-600 font-medium">{timeDisplay}</div>}
            </div>

            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-base font-bold text-slate-900">참여자</h2>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                        {participants.length}
                    </span>
                </div>

                <ParticipantGrid
                    participants={sharedParticipants}
                    interaction="readonly"
                    className="gap-2"
                    itemClassName="bg-white border border-slate-200 shadow-sm"
                />
            </div>

            {calendar.description && (
                <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">
                    {calendar.description}
                </p>
            )}
        </div>
    );
}
