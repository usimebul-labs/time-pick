'use client';

import { EventDetail, getEventWithParticipation, ParticipantSummary } from "@/app/actions/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { addMinutes, eachDayOfInterval, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFlow } from "../../../stackflow";

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-200 rounded shadow-md text-xs">
                <p className="font-semibold">{label}</p>
                <p className="text-primary">{`가능 인원: ${payload[0].value}명`}</p>
            </div>
        );
    }
    return null;
};

export default function Confirmed({ params: { id } }: { params: { id: string } }) {
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { replace } = useFlow();

    useEffect(() => {
        const fetchEvent = async () => {
            const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
            const guestPin = guestSessions[id];

            const { event, participants, error } = await getEventWithParticipation(id, guestPin);

            if (error) {
                setError(error);
            } else {
                setEvent(event);
                setParticipants(participants || []);
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    // Graph Data Processing
    const chartData = useMemo(() => {
        if (!event) return [];

        const slotCounts: Record<string, number> = {};
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        // 1. Initialize all slots with 0
        if (event.type === 'monthly') {
            // Generate all days in range
            const allDays = eachDayOfInterval({ start: startDate, end: endDate });
            allDays.forEach(day => {
                const key = format(day, "MM/dd");
                slotCounts[key] = 0;
            });
        } else {
            // Weekly: Generate time slots for each day in range
            // Only if start/end time exists, otherwise full day?? 
            // usually weekly has time range.
            if (event.startTime && event.endTime) {
                const startHour = parseInt(event.startTime.split(':')[0]!);
                const endHour = parseInt(event.endTime.split(':')[0]!);

                const allDays = eachDayOfInterval({ start: startDate, end: endDate });

                allDays.forEach(day => {
                    // Skip excluded days?
                    if (event.excludedDays.includes(day.getDay())) return;

                    let current = new Date(day);
                    current.setHours(startHour, 0, 0, 0); // Start at startHour:00

                    const endOfDay = new Date(day);
                    endOfDay.setHours(endHour, 0, 0, 0); // End at endHour:00

                    // Loop 30 min intervals
                    while (current < endOfDay) { // < because 14:00-15:00 means 14:00, 14:30. 15:00 is end.
                        const key = format(current, "MM/dd HH:mm");
                        slotCounts[key] = 0;
                        current = addMinutes(current, 30);
                    }
                });
            }
        }

        // 2. Count participants
        if (participants) {
            participants.forEach(p => {
                p.availabilities.forEach(iso => {
                    const date = parseISO(iso);
                    let key;
                    if (event.type === 'monthly') {
                        key = format(date, "MM/dd");
                    } else {
                        key = format(date, "MM/dd HH:mm");
                    }

                    // Only increment if key exists (within range) or if we want to show out of bounds?
                    // Ideally we only care about valid slots. 
                    if (slotCounts.hasOwnProperty(key)) {
                        slotCounts[key] = (slotCounts[key] || 0) + 1;
                    }
                });
            });
        }

        // Convert to array and sort
        return Object.entries(slotCounts)
            .map(([time, count]) => ({ time, count }))
            .sort((a, b) => {
                return a.time.localeCompare(b.time);
            });
    }, [event, participants]);

    // Top 5 Logic
    const top5 = useMemo(() => {
        if (!chartData || chartData.length === 0) return [];
        return [...chartData]
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [chartData]);


    if (loading) return (
        <AppScreen>
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </AppScreen>
    );

    if (error || !event) return (
        <AppScreen>
            <div className="flex flex-col justify-center items-center h-screen p-4 text-center bg-gray-50">
                <h2 className="text-lg font-bold mb-1">오류가 발생했습니다</h2>
                <p className="text-gray-500">{error || "일정을 찾을 수 없습니다."}</p>
            </div>
        </AppScreen>
    );

    return (
        <AppScreen>
            <div className="flex flex-col h-full bg-white overflow-y-auto pb-8">
                {/* 1. Header & Description */}
                <div className="p-6 pb-2">
                    <h1 className="text-2xl font-bold mb-2 break-keep">{event.title}</h1>
                    {event.description && (
                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4 whitespace-pre-wrap">
                            {event.description}
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                        <div className="flex items-center">
                            <CalendarIcon className="w-3.5 h-3.5 mr-2" />
                            <span>
                                {event.startDate} ~ {event.endDate}
                            </span>
                        </div>
                        {event.startTime && (
                            <div className="flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-2" />
                                <span>{event.startTime} ~ {event.endTime}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-2 bg-gray-50 my-2" />

                {/* 3. Participants */}
                <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            참여자
                            <span className="ml-1 text-primary text-base font-semibold">{participants.length}</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {participants.map(p => (
                            <div key={p.id} className="flex flex-col items-center w-14">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-sm mb-1.5">
                                    <AvatarImage src={p.avatarUrl || undefined} />
                                    <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                                        {p.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-700 truncate w-full text-center font-medium">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-2 bg-gray-50 my-2" />

                {/* 4. Density Graph */}
                <div className="p-5 overflow-hidden">
                    <h2 className="text-lg font-bold mb-4">참여 가능 시간 분포</h2>
                    <div className="h-56 w-[calc(100%+var(--spacing)*4)]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                    minTickGap={30}
                                />
                                <YAxis
                                    hide
                                    domain={[0, 'dataMax + 1']}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="h-2 bg-gray-50 my-2" />

                {/* 5. TOP 5 */}
                <div className="p-5">
                    <h2 className="text-lg font-bold mb-4 flex items-center">
                        <span className="text-orange-500 mr-1.5">★</span> TOP 5 추천 시간
                    </h2>
                    <div className="space-y-3">
                        {top5.length > 0 ? top5.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100">
                                <div className="flex items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${idx === 0 ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-200'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="font-semibold text-gray-800">{item.time}</span>
                                </div>
                                <div className="text-sm font-semibold text-orange-600">
                                    {item.count}명 가능
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-4 text-gray-400 text-sm">
                                데이터가 부족합니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppScreen>
    );
}
