import { DashboardCalendar } from "@/app/actions/calendar";
import { Button } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { MoreVertical, Share2 } from "lucide-react";
import { ParticipantFacepile } from "./ParticipantFacepile";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { useDashboardStore } from "../hooks/useDashboardStore";
import { useFlow } from "../../../../stackflow";
import { MouseEventHandler } from "react";


const DDay = ({ deadline }: { deadline: string }) => {
    const today = new Date();
    const target = parseISO(deadline);
    const diff = differenceInCalendarDays(target, today);

    if (diff < 0) return null; // Already passed

    const isUrgent = diff <= 3;
    const text = diff === 0 ? "D-Day" : `D-${diff}`;

    return (
        <span className={`ml-1.5 font-bold ${isUrgent ? "text-red-500" : "text-slate-500"}`}>
            ({text})
        </span>
    );
}

interface CalendarItemProps {
    calendar: DashboardCalendar;
    user: User;
    type: "my" | "joined";
}

export function CalendarItem({ calendar, user, type }: CalendarItemProps) {
    const { push } = useFlow();
    const { openShare, openMenu, openParticipant } = useDashboardStore();

    const handleSelect: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        if (calendar.isConfirmed) {
            push("Result", { id: calendar.id });
        } else {
            push("Select", { id: calendar.id });
        }
    }

    const handleShare: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        openShare(calendar.id);
    }

    const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        openMenu(calendar.id);
    }

    const handleShowParticipants: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        openParticipant(calendar.participants, calendar.participants.length);
    }

    const getStatusStyles = () => {
        if (calendar.isConfirmed) {
            return {
                border: "border-l-4 border-l-green-500",
                badgeText: "확정됨",
                badgeColor: "text-green-600"
            };
        }
        if (type === "my") {
            return {
                border: "border-l-4 border-l-indigo-500",
                badgeText: "내가 만든",
                badgeColor: "text-indigo-600"
            };
        }
        return {
            border: "border-l-4 border-l-slate-300",
            badgeText: "참여 중",
            badgeColor: "text-slate-500"
        };
    };

    const styles = getStatusStyles();

    return (
        <div
            className={`bg-white rounded-xl p-4 shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:border-indigo-200 active:scale-[0.99] group relative ${styles.border}`}
            onClick={handleSelect}
        >
            {(type === "my" || type === "joined") &&
                <div className="absolute top-3 right-3 flex items-center gap-0.5">
                    <Button variant="ghost" size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        onClick={handleShare}>
                        <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Button>

                    {type === "my" && !calendar.isConfirmed && (
                        <Button variant="ghost" size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            onClick={handleMenuOpen}>
                            <MoreVertical className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </Button>
                    )}
                </div>
            }

            <h3 className="text-base font-bold text-slate-900 mb-0.5 pr-12 leading-tight line-clamp-1">
                {calendar.title}
            </h3>
            <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-slate-500 font-medium flex items-center">
                    <span className={`font-bold mr-2 ${styles.badgeColor}`}>
                        {styles.badgeText}
                    </span>
                    <span className="w-px h-2.5 bg-slate-200 mr-2"></span>

                    {format(parseISO(calendar.startDate), "MM.dd")} ~ {format(parseISO(calendar.endDate), "MM.dd")}
                    {calendar.deadline && (
                        <>
                            <span className="mx-2 text-slate-300">|</span>
                            {format(parseISO(calendar.deadline), "MM.dd")} 마감 <DDay deadline={calendar.deadline} />
                        </>
                    )}
                </span>

                <div className="flex justify-end items-center gap-1.5">
                    {calendar.participants.length > 0 ? (
                        <>
                            <ParticipantFacepile participants={calendar.participants} totalCount={calendar.participants.length} user={user} clickHandler={handleShowParticipants} />
                            <span className="text-[10px] text-indigo-600 font-semibold ml-0.5">
                                {calendar.participants.length}명
                            </span>
                        </>
                    ) : (
                        <span className="text-[11px] text-slate-300 font-medium">참여 없음</span>
                    )}
                </div>
            </div>

        </div>
    );
}
