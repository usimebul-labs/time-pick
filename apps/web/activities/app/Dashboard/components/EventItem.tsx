import { DashboardEvent } from "@/app/actions/calendar";
import { Button } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { MoreVertical, Share2 } from "lucide-react";
import { ParticipantFacepile } from "./ParticipantFacepile";
import { differenceInCalendarDays, parseISO } from "date-fns";
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

interface EventItemProps {
    event: DashboardEvent;
    user: User;
    type: "my" | "joined";
}

export function EventItem({ event, user, type }: EventItemProps) {
    const { push } = useFlow();
    const { openShare, openMenu, openParticipant } = useDashboardStore();

    const handleSelect: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        push("Select", { id: event.id });
    }

    const handleShare: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        openShare(event.id);
    }

    const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        openMenu(event.id);
    }

    const handleShowParticipants: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        openParticipant(event.participants, event.participants.length);
    }

    return (
        <div
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:border-indigo-200 active:scale-[0.99] group relative"
            onClick={handleSelect}
        >
            {type === "my" &&
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        onClick={handleShare}>
                        <Share2 className="w-4 h-4" strokeWidth={1.5} />
                    </Button>

                    <Button variant="ghost" size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        onClick={handleMenuOpen}>
                        <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                </div>
            }

            <h3 className="text-[17px] font-bold text-slate-900 mb-1 pr-16 leading-tight line-clamp-1">
                {event.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4 flex items-center">
                {event.deadline ? (
                    <>
                        {event.deadline} 마감 <DDay deadline={event.deadline} />
                    </>
                ) : "마감일 없음"}
            </p>

            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    {event.participants.length > 0 ?
                        <ParticipantFacepile participants={event.participants} totalCount={event.participants.length} user={user} clickHandler={handleShowParticipants} /> :
                        <span className="text-xs text-slate-400 font-medium">아직 참여자가 없어요</span>
                    }
                </div>

                {event.participants.length > 0 &&
                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-md">
                        {event.participants.length}명 참여 중
                    </span>
                }
            </div>

        </div>
    );
}
