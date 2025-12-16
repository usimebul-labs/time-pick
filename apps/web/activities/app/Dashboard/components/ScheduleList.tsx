import { DashboardEvent } from "@/app/actions/calendar";
import { Button } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { Calendar, ChevronDown, ChevronUp, MoreVertical, Share2, Users } from "lucide-react";
import { ParticipantFacepile } from "./ParticipantFacepile";
import { differenceInCalendarDays, parseISO } from "date-fns";

interface ScheduleListProps {
    title: string;
    icon: React.ReactNode;
    schedules: DashboardEvent[];
    showAll: boolean;
    onToggleShowAll: (show: boolean) => void;
    user: User | null;
    initialDisplayCount: number;
    emptyMessage: string;
    onCardClick: (id: string) => void;
    onShareClick?: (id: string) => void;
    onMenuClick?: (id: string) => void;
    onParticipantClick: (participants: any[], count: number) => void;
    onCreateSchedule?: () => void;
    type: "my" | "joined";
}

export function ScheduleList({
    title,
    icon,
    schedules,
    showAll,
    onToggleShowAll,
    user,
    initialDisplayCount,
    emptyMessage,
    onCardClick,
    onShareClick,
    onMenuClick,
    onParticipantClick,
    onCreateSchedule,
    type
}: ScheduleListProps) {
    const displayedSchedules = showAll ? schedules : schedules.slice(0, initialDisplayCount);

    const getDDay = (deadline: string) => {
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
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                    {icon} {title}
                </h2>
            </div>

            <div className="space-y-4">
                {displayedSchedules.length > 0 ? (
                    displayedSchedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className={`bg-white rounded-lg p-5 shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:border-indigo-100 active:scale-[0.99] ${type === 'my' ? 'group relative' : ''}`}
                            onClick={() => onCardClick(schedule.id)}
                        >
                            {type === 'my' && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                                        onClick={(e) => { e.stopPropagation(); onShareClick && onShareClick(schedule.id); }}
                                    >
                                        <Share2 className="w-4 h-4" strokeWidth={1.5} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full"
                                        onClick={(e) => { e.stopPropagation(); onMenuClick && onMenuClick(schedule.id); }}
                                    >
                                        <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                                    </Button>
                                </div>
                            )}

                            {type === 'my' ? (
                                <>
                                    <h3 className="text-[17px] font-bold text-slate-900 mb-1 pr-16 leading-tight line-clamp-1">{schedule.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium mb-4 flex items-center">
                                        {schedule.deadline ? (
                                            <>
                                                {schedule.deadline} 마감
                                                {getDDay(schedule.deadline)}
                                            </>
                                        ) : "마감일 없음"}
                                    </p>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            {schedule.participantCount > 0 ? (
                                                <ParticipantFacepile participants={schedule.participants} totalCount={schedule.participantCount} user={user} onClick={onParticipantClick} />
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium">아직 참여자가 없어요</span>
                                            )}
                                        </div>
                                        {schedule.participantCount > 0 && (
                                            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-md">
                                                {schedule.participantCount}명 참여 중
                                            </span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">{schedule.title}</h3>
                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                            참여함
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 mb-1">참여자</span>
                                            {schedule.participantCount > 0 ? (
                                                <ParticipantFacepile participants={schedule.participants} totalCount={schedule.participantCount} user={user} onClick={onParticipantClick} />
                                            ) : (
                                                <span className="text-xs text-slate-400">없음</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium flex items-center">
                                            {schedule.deadline ? (
                                                <>
                                                    {schedule.deadline} 까지
                                                    {getDDay(schedule.deadline)}
                                                </>
                                            ) : "상시"}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-dashed border-slate-200">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            {type === 'my' ? <Calendar className="w-6 h-6 text-slate-300" strokeWidth={1.5} /> : <Users className="w-6 h-6 text-slate-300" strokeWidth={1.5} />}
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{emptyMessage}</p>
                        {type === 'my' && onCreateSchedule && (
                            <Button variant="link" onClick={onCreateSchedule} className="text-indigo-600 text-xs font-semibold p-0 h-auto mt-1">
                                첫 일정을 만들어보세요
                            </Button>
                        )}
                    </div>
                )}

                {schedules.length > initialDisplayCount && (
                    <div className="flex justify-center mt-2">
                        <Button
                            variant="ghost"
                            onClick={() => onToggleShowAll(!showAll)}
                            className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium gap-1"
                        >
                            {showAll ? (
                                <>접기 <ChevronUp className="w-4 h-4" strokeWidth={1.5} /></>
                            ) : (
                                <>더 보기 ({schedules.length - initialDisplayCount}) <ChevronDown className="w-4 h-4" strokeWidth={1.5} /></>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
