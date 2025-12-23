import { User } from "@supabase/supabase-js";
import { Calendar } from "lucide-react";
import { CalendarItem } from "./CalendarItem";
import { DashboardCalendar } from "@/app/actions/calendar/types";

const Empty = () => {
    return <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-dashed border-slate-200">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-slate-500 text-sm font-medium">일정이 없어요</p>
    </div>
}

// const Loading = () => { ... } // Loading will be handled in parent

interface CalendarListProps {
    user: User;
    calendars: DashboardCalendar[];
}

export function CalendarList({ user, calendars }: CalendarListProps) {
    if (calendars.length === 0) return <Empty />

    return (
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto px-1 pb-20">
            {calendars.map((calendar) => (
                <CalendarItem
                    key={calendar.id}
                    calendar={calendar}
                    user={user}
                    type={calendar.isHost ? "my" : "joined"}
                />
            ))}
        </div>
    );
}
