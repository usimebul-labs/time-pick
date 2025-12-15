import { format, parseISO } from "date-fns";
import { useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartDataPoint, SelectedSlot } from "../useStatus";
import { ParticipantSummary, EventDetail } from "@/app/actions/calendar";

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

interface StatusChartProps {
    chartData: ChartDataPoint[];
    maxCount: number;
    selectedCount: number | null;
    setSelectedCount: (count: number | null) => void;
    setSelectedSlot: (slot: SelectedSlot | null) => void;
    selectedVipIds: Set<string>;
    participants: ParticipantSummary[];
    event: EventDetail;
}

export function StatusChart({
    chartData,
    maxCount,
    selectedCount,
    setSelectedCount,
    setSelectedSlot,
    selectedVipIds,
    participants,
    event
}: StatusChartProps) {
    const [isDragging, setIsDragging] = useState(false);
    const chartRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        updateSelection(e.clientY);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        updateSelection(e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const updateSelection = (clientY: number) => {
        if (!chartRef.current) return;
        const rect = chartRef.current.getBoundingClientRect();

        const chartTop = rect.top + 10;
        const chartHeight = rect.height - 40;

        let relativeY = (clientY - chartTop) / chartHeight;
        relativeY = Math.max(0, Math.min(1, relativeY));

        const value = Math.round(maxCount * (1 - relativeY));
        const clampedValue = Math.max(0, Math.min(maxCount, value));

        if (clampedValue === 0) {
            setSelectedCount(null);
            setSelectedSlot(null);
            return;
        }

        if (selectedCount !== clampedValue) {
            setSelectedCount(clampedValue);
            setSelectedSlot(null);
        }
    };

    // Custom Dot Component (Defined inside to access props/state closure if needed, or pass props)
    // But better to define outside or use props
    const CustomizedDot = (props: any) => {
        const { cx, cy, payload } = props;

        // Mode 1: VIP Filtering (Default)
        const isVipParams = selectedVipIds.size > 0 && payload.vipCount === selectedVipIds.size;
        if (isVipParams) {
            return (
                <circle cx={cx} cy={cy} r={4} fill="#6366f1" stroke="#fff" strokeWidth={1} style={{ pointerEvents: 'none' }} />
            );
        }

        // Mode 2: Count Filtering
        if (selectedCount !== null) {
            if (payload.count === selectedCount) {
                return (
                    <circle cx={cx} cy={cy} r={5} fill="#f97316" stroke="#fff" strokeWidth={2} />
                );
            }
            return null;
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
            setSelectedCount(null);
        }
    };

    return (
        <div className="p-5 overflow-hidden">
            <h2 className="text-lg font-bold mb-1">언제가 가장 좋을까요? 🤔</h2>
            <p className="text-sm text-gray-500 mb-6">
                {selectedCount !== null ? (
                    <span className="text-primary font-bold">{selectedCount}명이 가능한 시간들이에요!</span>
                ) : (
                    "왼쪽 슬라이더를 위아래로 움직여서 확인해보세요!"
                )}
            </p>
            <div className="h-56 w-[calc(100%+var(--spacing)*2)] ml-3 relative select-none touch-none" ref={chartRef}>
                {/* Drag Overlay */}
                <div
                    className="absolute top-2 -left-7 bottom-8 w-8 z-20 cursor-ns-resize flex flex-col items-center"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <div className="absolute top-0 bottom-0 w-1.5 bg-gray-100/80 rounded-full" />
                    <div
                        className="absolute bottom-0 w-1.5 bg-primary/20 rounded-full transition-all duration-75"
                        style={{ height: `${((selectedCount ?? 0) / maxCount) * 100}%` }}
                    />
                    <div
                        className={`absolute w-6 h-6 bg-white rounded-full shadow-[0_2px_12px_rgba(249,115,22,0.25)] border-[2px] border-white ring-1 ring-orange-100 flex items-center justify-center z-30 transition-transform duration-100 ${isDragging ? 'scale-110' : 'scale-100'}`}
                        style={{
                            bottom: `${((selectedCount ?? 0) / maxCount) * 100}%`,
                            transform: `translateY(50%)`
                        }}
                    >
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-[10px] font-extrabold text-primary pt-[1px]">{selectedCount ?? 0}</span>
                        </div>
                        {isDragging && <div className="absolute inset-0 rounded-full ring-2 ring-primary ring-offset-2 transition-all" />}
                    </div>
                </div>

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
                            domain={[0, maxCount]}
                            hide
                            width={0}
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
    );
}
