import { User } from "@supabase/supabase-js";
import { Calendar } from "lucide-react";
import { useCalendars } from "../hooks/useCalendars";
import { CalendarItem } from "./CalendarItem";

const Empty = () => {
    return <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-dashed border-slate-200">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-slate-500 text-sm font-medium">일정이 없어요</p>
    </div>
}

const Loading = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                        <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse" />
                    </div>
                    <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse mb-4" />
                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="w-8 h-8 bg-slate-100 rounded-full ring-2 ring-white animate-pulse" />
                            ))}
                        </div>
                        <div className="h-6 w-16 bg-slate-100 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface CalendarListProps {
    user: User;
    type: "my" | "joined";
}

export function CalendarList({ user, type }: CalendarListProps) {
    const { calendars, loading, error } = useCalendars(user, type);

    if (loading) return <Loading />
    if (error) return <div>에러: {error}</div>
    if (calendars.length === 0) return <Empty />

    return (
        <div className="space-y-4 max-h-[300px] overflow-y-auto px-1 pb-1">
            {calendars.map((calendar) => (
                <CalendarItem key={calendar.id} calendar={calendar} user={user} type={type} />
            ))}
        </div>
    );
}
