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

    // Advanced Features State
    const [selectedVipIds, setSelectedVipIds] = useState<Set<string>>(new Set());
    const [selectedSlot, setSelectedSlot] = useState<{ time: string; count: number; availableParticipants: ParticipantSummary[] } | null>(null);

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

    const handleVipToggle = (participantId: string) => {
        const newSet = new Set(selectedVipIds);
        if (newSet.has(participantId)) {
            newSet.delete(participantId);
        } else {
            newSet.add(participantId);
        }
        setSelectedVipIds(newSet);
    };

    // Graph Data Processing
    const chartData = useMemo(() => {
        if (!event) return [];

        const slotData: Record<string, { time: string, count: number, vipCount: number }> = {};
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        // 1. Initialize all slots with 0
        if (event.type === 'monthly') {
            const allDays = eachDayOfInterval({ start: startDate, end: endDate });
            allDays.forEach(day => {
                const key = format(day, "MM/dd");
                slotData[key] = { time: key, count: 0, vipCount: 0 };
            });
        } else {
            if (event.startTime && event.endTime) {
                const startHour = parseInt(event.startTime.split(':')[0]!);
                const endHour = parseInt(event.endTime.split(':')[0]!);
                const allDays = eachDayOfInterval({ start: startDate, end: endDate });

                allDays.forEach(day => {
                    if (event.excludedDays.includes(day.getDay())) return;

                    let current = new Date(day);
                    current.setHours(startHour, 0, 0, 0);
                    const endOfDay = new Date(day);
                    endOfDay.setHours(endHour, 0, 0, 0);

                    while (current < endOfDay) {
                        const key = format(current, "MM/dd HH:mm");
                        slotData[key] = { time: key, count: 0, vipCount: 0 };
                        current = addMinutes(current, 30);
                    }
                });
            }
        }

        // 2. Count participants
        if (participants) {
            participants.forEach(p => {
                const isVip = selectedVipIds.has(p.id);
                p.availabilities.forEach(iso => {
                    const date = parseISO(iso);
                    let key;
                    if (event.type === 'monthly') {
                        key = format(date, "MM/dd");
                    } else {
                        key = format(date, "MM/dd HH:mm");
                    }

                    if (slotData[key]) {
                        slotData[key].count += 1;
                        if (isVip) {
                            slotData[key].vipCount += 1;
                        }
                    }
                });
            });
        }

        return Object.values(slotData).sort((a, b) => a.time.localeCompare(b.time));
    }, [event, participants, selectedVipIds]);

    // Top 3 Logic
    const top3 = useMemo(() => {
        if (!chartData || chartData.length === 0) return [];

        let candidates = [...chartData];

        // Strict Filter: If VIPs selected, only show slots where ALL VIPs are present
        if (selectedVipIds.size > 0) {
            candidates = candidates.filter(d => d.vipCount === selectedVipIds.size);
        }

        return candidates
            .sort((a, b) => {
                // Primary sort: count (desc)
                if (b.count !== a.count) return b.count - a.count;
                // Secondary sort: time (asc)
                return a.time.localeCompare(b.time);
            })
            .slice(0, 3);
    }, [chartData, selectedVipIds]);

    // Custom Dot Component
    const CustomizedDot = (props: any) => {
        const { cx, cy, payload } = props;
        const rankIndex = top3.findIndex(item => item.time === payload.time);
        const isTop3 = rankIndex !== -1;
        const isVipParams = selectedVipIds.size > 0 && payload.vipCount > 0;

        if (isTop3) {
            return (
                <g style={{ pointerEvents: 'none' }}>
                    <circle cx={cx} cy={cy} r={10} fill="#f97316" stroke="#fff" strokeWidth={2} />
                    <text x={cx} y={cy} dy={4} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">
                        {rankIndex + 1}
                    </text>
                </g>
            );
        }

        if (isVipParams) {
            return (
                <circle cx={cx} cy={cy} r={4} fill="#6366f1" stroke="#fff" strokeWidth={1} style={{ pointerEvents: 'none' }} />
            );
        }

        return null;
    };

    const handleChartClick = (data: any) => {
        let targetSlot = null;

        // 1. Try activePayload
        if (data && data.activePayload && data.activePayload.length > 0) {
            targetSlot = data.activePayload[0].payload;
        }
        // 2. Fallback: Try activeLabel
        else if (data && data.activeLabel) {
            targetSlot = chartData.find(d => d.time === data.activeLabel);
        }

        // Debug log
        console.log("Chart Click:", data, "Target:", targetSlot);

        if (targetSlot) {
            // Filter participants available at this slot
            const available = participants.filter(p => {
                return p.availabilities.some(iso => {
                    const date = parseISO(iso);
                    let key;
                    if (event?.type === 'monthly') key = format(date, "MM/dd");
                    else key = format(date, "MM/dd HH:mm");
                    return key === targetSlot.time;
                });
            });

            setSelectedSlot({
                time: targetSlot.time,
                count: targetSlot.count,
                availableParticipants: available
            });
        }
    };

    // Footer Actions
    const handleEdit = () => {
        replace("Join", { id });
    };

    const handleComplete = () => {
        const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
        // Is current user a guest for this event?
        const isGuest = !!guestSessions[id];

        if (isGuest) {
            alert("일정 확인이 완료되었습니다. 창을 닫아주세요.");
            window.close();
        } else {
            replace("Dashboard", {});
        }
    };

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
            <div className="flex flex-col h-full bg-white relative">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto pb-32">
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
                                <span>{event.startDate} ~ {event.endDate}</span>
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

                    {/* 3. Participants (Interactive) */}
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                참여자
                                <span className="ml-1 text-primary text-base font-semibold">{participants.length}</span>
                            </h2>
                            <span className="text-xs text-gray-400">참여자를 눌러 필터링해보세요</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {participants.length > 0 ? (
                                participants.map((p) => {
                                    const isSelected = selectedVipIds.has(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => handleVipToggle(p.id)}
                                            className={`flex items-center rounded-full px-2 py-1 border transition-all ${isSelected
                                                ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                                                : "bg-gray-50 border-transparent hover:bg-gray-100"
                                                }`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-600 mr-1.5 overflow-hidden">
                                                {p.avatarUrl ? (
                                                    <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    p.name[0]
                                                )}
                                            </div>
                                            <span className={`text-xs ${isSelected ? "text-indigo-700 font-semibold" : "text-gray-700"}`}>
                                                {p.name}
                                            </span>
                                        </button>
                                    );
                                })
                            ) : (
                                <span className="text-xs text-gray-400 pl-1">아직 참여자가 없습니다.</span>
                            )}
                        </div>
                    </div>

                    <div className="h-2 bg-gray-50 my-2" />

                    {/* 4. Density Graph (Dual Layer -> Single Layer with Dots) */}
                    <div className="p-5 overflow-hidden">
                        <h2 className="text-lg font-bold mb-4">참여 가능 시간 분포</h2>
                        <p className="text-xs text-gray-400 mb-4">그래프를 눌러 상세 정보를 확인하세요</p>
                        <div className="h-56 w-[calc(100%+var(--spacing)*4)]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                                    onClick={handleChartClick}
                                >
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
                                    <YAxis hide domain={[0, 'dataMax + 2']} />
                                    {/* Tooltip can remain, but main interaction is click */}
                                    <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />

                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        dot={<CustomizedDot />}
                                        activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* 5. Bottom Details Panel (Static) */}
                    <div className="border-t border-gray-100 bg-gray-50/50 min-h-[160px]">
                        {selectedSlot ? (
                            <div className="p-5 animate-in fade-in duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{selectedSlot.time}</h3>
                                        <p className="text-sm text-primary font-medium">
                                            {selectedSlot.count}명 참여 가능
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedSlot(null)} className="p-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50">
                                        <Users className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    {selectedSlot.availableParticipants.length > 0 ? selectedSlot.availableParticipants.map(p => {
                                        const isVip = selectedVipIds.has(p.id);
                                        return (
                                            <div key={p.id} className="flex flex-col items-center">
                                                <Avatar className={`w-9 h-9 mb-1 border-2 ${isVip ? 'border-indigo-400' : 'border-transparent'}`}>
                                                    <AvatarImage src={p.avatarUrl || undefined} />
                                                    <AvatarFallback className="bg-white border border-gray-100 text-gray-600 text-[10px]">
                                                        {p.name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className={`text-[10px] text-center truncate w-full ${isVip ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}>
                                                    {p.name}
                                                </span>
                                            </div>
                                        );
                                    }) : (
                                        <p className="col-span-5 text-center text-gray-400 text-xs py-2">참여자가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-sm p-5">
                                <Users className="w-6 h-6 mb-2 opacity-20" />
                                <p>그래프의 점을 클릭하여<br />상세 정보를 확인하세요</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 pb-8 z-30 flex gap-3">
                    <button
                        onClick={handleEdit}
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                    >
                        다시 수정하기
                    </button>
                    <button
                        onClick={handleComplete}
                        className="flex-1 py-3 px-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                    >
                        완료
                    </button>
                </div>
            </div>
        </AppScreen>
    );
}
