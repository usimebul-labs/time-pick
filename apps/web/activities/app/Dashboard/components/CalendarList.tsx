import { User } from "@supabase/supabase-js";
import { Calendar } from "lucide-react";
import { CalendarItem } from "./CalendarItem";
import { DashboardCalendar } from "@/app/actions/calendar/types";
import { useCalendars } from "../hooks/useCalendars";


const ListLoading = () => {
    return (
        <div className="space-y-4 px-1 pb-20">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 border-l-4 border-l-slate-100 relative">
                    {/* Title */}
                    <div className="h-5 bg-slate-100 rounded-md w-1/2 mb-4 animate-pulse" />

                    {/* Bottom Row */}
                    <div className="flex justify-between items-center mt-2">
                        {/* Date/Badge Area */}
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
                            <div className="h-3 w-[1px] bg-slate-100" />
                            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                        </div>

                        {/* Facepile Area */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="w-6 h-6 rounded-full bg-slate-100 ring-1 ring-white animate-pulse" />
                                ))}
                            </div>
                            <div className="w-6 h-3 bg-slate-100 rounded animate-pulse ml-0.5" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Empty = () => {
    return <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-dashed border-slate-200">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-slate-500 text-sm font-medium">일정이 없어요</p>
    </div>
}


interface CalendarListProps {
    user: User;
}

export function CalendarList({ user }: CalendarListProps) {
    const { calendars, loading, error } = useCalendars(user!);

    if (loading) return <ListLoading />
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>
    if (calendars.length === 0) return <Empty />

    return (
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto px-1 pb-20">
            {calendars.map((calendar) => (
                <CalendarItem key={calendar.id} calendar={calendar} user={user} />
            ))}
        </div>
    );
}
