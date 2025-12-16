import { Button } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { EventItem } from "./EventItem";




const Empty = () => {
    return <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg border border-dashed border-slate-200">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-slate-500 text-sm font-medium">내 일정이 없네요</p>
    </div>
}


interface Events {
    user: User;
    type: "my" | "joined";
}

const initCount = 3;
export function EventList({ user, type }: Events) {
    const { events, loading, error } = useEvents(user, type);
    const [showAll, setShowAll] = useState(false);

    if (loading) return <div>로딩중...</div>
    if (error) return <div>에러: {error}</div>
    if (events.length === 0) return <Empty />

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <EventItem
                    key={event.id}
                    event={event}
                    user={user}
                    type={type}
                />
            ))}

            {events.length > initCount && (
                <div className="flex justify-center mt-2">
                    <Button variant="ghost"
                        className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium gap-1"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ?
                            <>접기 <ChevronUp className="w-4 h-4" strokeWidth={1.5} /></> :
                            <>더 보기 ({events.length - initCount}) <ChevronDown className="w-4 h-4" strokeWidth={1.5} /></>
                        }
                    </Button>
                </div>
            )}
        </div>
    );
}
