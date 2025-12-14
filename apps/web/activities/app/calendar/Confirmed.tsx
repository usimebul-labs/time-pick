'use client';

import { EventDetail, getEventWithParticipation, ParticipantSummary } from "@/app/actions/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { addMinutes, eachDayOfInterval, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Label, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
    const [selectedCount, setSelectedCount] = useState<number | null>(null);

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
                        slotData[key]!.count += 1;
                        if (isVip) {
                            slotData[key]!.vipCount += 1;
                        }
                    }
                });
            });
        }

        return Object.values(slotData).sort((a, b) => a.time.localeCompare(b.time));
    }, [event, participants, selectedVipIds]);

    const handleYAxisClick = (count: number) => {
        if (selectedCount === count) {
            setSelectedCount(null);
        } else {
            setSelectedCount(count);
            // Clear slot selection when filtering by count to avoid confusion
            setSelectedSlot(null);
        }
    };

    // Custom Tick for clickable Y-Axis
    const CustomYAxisTick = (props: any) => {
        const { x, y, payload } = props;
        const isSelected = selectedCount === payload.value;
        return (
            <g transform={`translate(${x},${y})`} style={{ cursor: 'pointer' }} onClick={() => handleYAxisClick(payload.value)}>
                <text
                    x={0}
                    y={0}
                    dy={4}
                    textAnchor="end"
                    fill={isSelected ? "#f97316" : "#666"}
                    fontSize={12}
                    fontWeight={isSelected ? "bold" : "normal"}
                >
                    {payload.value}명
                </text>
            </g>
        );
    };

    // Custom Dot Component
    const CustomizedDot = (props: any) => {
        const { cx, cy, payload } = props;

        // Mode 1: Count Filtering
        if (selectedCount !== null) {
            if (payload.count === selectedCount) {
                return (
                    <circle cx={cx} cy={cy} r={5} fill="#f97316" stroke="#fff" strokeWidth={2} />
                );
            }
            return null;
        }

        // Mode 2: VIP Filtering (Default)
        const isVipParams = selectedVipIds.size > 0 && payload.vipCount === selectedVipIds.size;
        if (isVipParams) {
            return (
                <circle cx={cx} cy={cy} r={4} fill="#6366f1" stroke="#fff" strokeWidth={1} style={{ pointerEvents: 'none' }} />
            );
        }

        return null;
    };

    const handleChartClick = (data: any) => {
        let targetSlot = null;
        if (data && data.activePayload && data.activePayload.length > 0) {
            targetSlot = data.activePayload[0].payload;
        } else if (data && data.activeLabel) {
            targetSlot = chartData.find(d => d.time === data.activeLabel);
        }

        if (targetSlot) {
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
            // Clear count selection if user directly clicks a slot
            setSelectedCount(null);
        }
    };

    // Footer Actions
    const handleEdit = () => {
        replace("SelectEdit", { id });
    };

    const handleComplete = () => {
        const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
        // Is current user a guest for this event?
        const isGuest = !!guestSessions[id];

        if (isGuest) {
            alert("일정 확인이 완료되었어요! 창을 닫아도 좋아요 👋");
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
        <AppScreen appBar={{ title: event.title }}>
            <div className="flex flex-col h-full bg-white relative">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto pb-32">
                    {/* 4. Density Graph */}
                    <div className="p-5 overflow-hidden">
                        <h2 className="text-lg font-bold mb-1">언제가 가장 좋을까요? 🤔</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {selectedCount !== null ? (
                                <span className="text-primary font-bold">{selectedCount}명이 가능한 시간들이에요!</span>
                            ) : (
                                "참여 인원 수(Y축)를 누르면 해당 날짜를 볼 수 있어요!"
                            )}
                        </p>
                        <div className="h-56 w-[calc(100%+var(--spacing)*2)] -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                                    <YAxis
                                        domain={[0, 'dataMax + 1']}
                                        allowDecimals={false}
                                        tick={<CustomYAxisTick />}
                                        width={40}
                                    />
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
                                    {selectedCount !== null && (
                                        <ReferenceLine y={selectedCount} stroke="#f97316" strokeDasharray="3 3" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="h-2 bg-gray-50 my-2" />

                    {/* Filtered Dates List (New Feature) */}
                    {selectedCount !== null ? (
                        <div className="p-5 pb-32">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span className="text-gray-900">{selectedCount}명이 되는 시간</span>
                                    <span className="text-primary font-bold">
                                        {chartData.filter(d => d.count === selectedCount).length}개
                                    </span>
                                </h2>
                                <button
                                    onClick={() => setSelectedCount(null)}
                                    className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
                                >
                                    필터 해제
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {chartData.filter(d => d.count === selectedCount).length > 0 ? (
                                    chartData.filter(d => d.count === selectedCount).map((d) => (
                                        <div key={d.time} className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                                            <span className="text-sm font-bold text-gray-800">{d.time}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
                                        해당 인원이 가능한 시간이 없어요 🥲
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* 4. Participants (Original View) */
                        <div className="p-5 pb-32">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-700" />
                                    <span className="text-gray-900">
                                        {selectedSlot ? `${selectedSlot.time}에` : "함께하는 사람들"}
                                    </span>
                                    <span className={`text-base font-bold ${selectedSlot ? "text-primary" : "text-gray-500"}`}>
                                        {selectedSlot ? selectedSlot.count : participants.length}명
                                    </span>
                                </h2>
                                {selectedSlot ? (
                                    <button
                                        onClick={() => setSelectedSlot(null)}
                                        className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
                                    >
                                        전체 친구 보기
                                    </button>
                                ) : (
                                    <span className="text-xs text-gray-400">친구를 눌러보세요!</span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(selectedSlot ? selectedSlot.availableParticipants : participants).length > 0 ? (
                                    (selectedSlot ? selectedSlot.availableParticipants : participants).map((p) => {
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
                                    <div className="w-full text-center py-8 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                                        <span className="text-2xl">👀</span>
                                        <span className="text-sm text-gray-400 font-medium">
                                            {selectedSlot ? "이 시간에는 가능한 친구가 없어요 ㅠㅠ" : "아직 참여한 친구가 없어요."}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 pb-8 z-30 flex gap-3">
                    <button
                        onClick={handleEdit}
                        className="flex-1 py-3.5 px-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                    >
                        일정 수정하기 ✏️
                    </button>
                    <button
                        onClick={handleComplete}
                        className="flex-1 py-3.5 px-4 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                    >
                        확인했어요 👌
                    </button>
                </div>
            </div>
        </AppScreen>
    );
}
