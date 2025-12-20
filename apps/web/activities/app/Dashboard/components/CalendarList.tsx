import { Button } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
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

const initCount = 3;
export function CalendarList({ user, type }: CalendarListProps) {
    const { calendars, loading, error } = useCalendars(user, type);
    const [showAll, setShowAll] = useState(false);

    if (loading) return <Loading />
    if (error) return <div>에러: {error}</div>
    if (calendars.length === 0) return <Empty />

    return (
        <div className="space-y-4">
            {calendars.map((calendar) => (
                <CalendarItem key={calendar.id} calendar={calendar} user={user} type={type} />
            ))}

            {calendars.length > initCount && (
                <div className="flex justify-center mt-2">
                    <Button variant="ghost"
                        className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium gap-1"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ?
                            <>접기 <ChevronUp className="w-4 h-4" strokeWidth={1.5} /></> :
                            <>더 보기 ({calendars.length - initCount}) <ChevronDown className="w-4 h-4" strokeWidth={1.5} /></>
                        }
                    </Button>
                </div>
            )}
        </div>
    );
}
