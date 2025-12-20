import { format, parseISO } from "date-fns";
import { useRef, useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartDataPoint, SelectedSlot } from "../useStatus";
import { ParticipantSummary, CalendarDetail } from "@/app/actions/calendar";

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
    calendar: CalendarDetail;
}

export function StatusChart({
    chartData,
    maxCount,
    selectedCount,
    setSelectedCount,
    setSelectedSlot,
    selectedVipIds,
    participants,
    calendar
}: StatusChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);

    // Window State
    const totalData = chartData.length;
    const minVisible = 5; // Minimum items to show
    // Default window size: min(total, 30)
    const [visibleCount, setVisibleCount] = useState(() => Math.min(totalData, 30));
    const [startIndex, setStartIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

    // Derived State
    // Ensure we don't go out of bounds
    const safeVisibleCount = Math.min(visibleCount, totalData);
    const safeStartIndex = Math.max(0, Math.min(startIndex, totalData - safeVisibleCount));

    const visibleData = chartData.slice(safeStartIndex, safeStartIndex + safeVisibleCount);

    // Zoom Logic (Wheel)
    // Use layout effect or effect to attach non-passive listener
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                e.stopPropagation();

                const delta = e.deltaY > 0 ? 1 : -1;
                // Use current state values from refs or closure if dependencies update
                // Since this effect depends on state, it will re-bind. 
                // To avoid stale closures without re-binding too much, we can rely on React re-binding or use refs.
                // Re-binding is fine for now.

                const step = Math.max(1, Math.round(safeVisibleCount * 0.1));
                const change = delta * step;

                let newVisibleCount = safeVisibleCount + change;
                newVisibleCount = Math.max(minVisible, Math.min(newVisibleCount, totalData));

                if (newVisibleCount !== safeVisibleCount) {
                    let newStartIndex = safeStartIndex;
                    if (newStartIndex + newVisibleCount > totalData) {
                        newStartIndex = Math.max(0, totalData - newVisibleCount);
                    }
                    setVisibleCount(newVisibleCount);
                    setStartIndex(newStartIndex);
                }
            } else {
                if (e.deltaX !== 0 || e.deltaY !== 0) {
                    // For horizontal scroll (pan), we might generally want native behavior if it's just scrolling the page?
                    // BUT if we want to pan the CHART, we should prevent default horizontal scroll of page (if any).
                    // If we are strictly panning the chart:
                    const move = (e.deltaX !== 0 ? e.deltaX : e.deltaY) > 0 ? 1 : -1;
                    const step = Math.max(1, Math.round(safeVisibleCount * 0.05));
                    let newStartIndex = safeStartIndex + (move * step);
                    newStartIndex = Math.max(0, Math.min(newStartIndex, totalData - safeVisibleCount));

                    if (newStartIndex !== safeStartIndex) {
                        // Create a "scrollable area" feeling
                        // If we are consuming the scroll, prevent default?
                        // If we prevent default, the page won't scroll vertically either.
                        // Usually, prevent default only if we successfully panned?
                        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                            // Horizontal intent -> Pan chart
                            e.preventDefault();
                            setStartIndex(newStartIndex);
                        } else {
                            // Vertical intent -> Let page scroll
                        }
                    }
                }
            }
        };

        container.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [safeVisibleCount, safeStartIndex, totalData, minVisible]);

    // Pan Logic (Drag on Chart)
    const [isPanning, setIsPanning] = useState(false);
    const lastPanX = useRef<number | null>(null);

    const handlePanDown = (e: React.PointerEvent) => {
        // Only pan if not clicking on the slider or specific elements
        // But the slider is outside the chart area generally
        setIsPanning(true);
        lastPanX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePanMove = (e: React.PointerEvent) => {
        if (!isPanning || lastPanX.current === null) return;

        const deltaX = lastPanX.current - e.clientX;
        // Sensitivity: 1 pixel = ? items.
        // Let's say 1 item per ~10-20 pixels usually, or calculate based on width.
        // Simple approximation:
        if (chartRef.current) {
            const width = chartRef.current.clientWidth;
            // items moved = (delta / width) * visibleCount
            const itemsMoved = (deltaX / width) * safeVisibleCount;

            if (Math.abs(itemsMoved) >= 1) {
                const step = Math.round(itemsMoved);
                let newStartIndex = safeStartIndex + step;
                newStartIndex = Math.max(0, Math.min(newStartIndex, totalData - safeVisibleCount));

                if (newStartIndex !== safeStartIndex) {
                    setStartIndex(newStartIndex);
                    lastPanX.current = e.clientX;
                }
            }
        }
    };

    const handlePanUp = (e: React.PointerEvent) => {
        setIsPanning(false);
        lastPanX.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Slider Logic
    const handleSliderDown = (e: React.PointerEvent) => {
        e.stopPropagation(); // Prevent chart pan
    };

    // Scrollbar Drag Logic
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollStartX = useRef<number | null>(null);
    const scrollStartIndexInit = useRef<number>(0);

    const handleScrollMouseDown = (e: React.PointerEvent) => {
        e.stopPropagation();
        setIsScrolling(true);
        scrollStartX.current = e.clientX;
        scrollStartIndexInit.current = safeStartIndex;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleScrollMouseMove = (e: React.PointerEvent) => {
        if (!isScrolling || scrollStartX.current === null || !scrollContainerRef.current) return;
        const deltaX = e.clientX - scrollStartX.current;
        const containerWidth = scrollContainerRef.current.clientWidth;

        // Ratio of movement
        // full width = totalData
        // movement % = deltaX / containerWidth
        // items moved = movement % * totalData
        const itemsMoved = Math.round((deltaX / containerWidth) * totalData);

        let newStartIndex = scrollStartIndexInit.current + itemsMoved;
        newStartIndex = Math.max(0, Math.min(newStartIndex, totalData - safeVisibleCount));
        setStartIndex(newStartIndex);
    };

    const handleScrollMouseUp = (e: React.PointerEvent) => {
        setIsScrolling(false);
        scrollStartX.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };


    // Existing Slider Logic (Vertical Selection)
    const handlePointerDown = (e: React.PointerEvent) => {
        e.stopPropagation(); // Stop propagation to prevent chart panning
        setIsDraggingSlider(true);
        updateSelection(e.clientY);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingSlider) return;
        updateSelection(e.clientY);
        e.stopPropagation();
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDraggingSlider(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        e.stopPropagation();
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

    // Custom Dot Component
    const CustomizedDot = (props: any) => {
        const { cx, cy, payload } = props;

        // Mode 1: VIP Filtering (Default)
        const isVipParams = selectedVipIds.size > 0 && payload.vipCount === selectedVipIds.size;
        if (isVipParams) {
            return (
                <circle cx={cx} cy={cy} r={4} fill="#818cf8" stroke="#fff" strokeWidth={1} style={{ pointerEvents: 'none' }} />
            );
        }

        // Mode 2: Count Filtering
        if (selectedCount !== null) {
            if (payload.count === selectedCount) {
                return (
                    <circle cx={cx} cy={cy} r={5} fill="#4f46e5" stroke="#fff" strokeWidth={2} />
                );
            }
            return null;
        }

        return null;
    };

    const handleChartClick = (data: any) => {
        // Prevent click if we were panning? simple click usually doesn't involve much movement
        // Recharts onClick might trigger after pan, but let's assume valid for now if minimal movement
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
                    if (calendar?.type === 'monthly') key = format(date, "MM/dd");
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
        <div className="p-5 overflow-hidden select-none">
            <h2 className="text-lg font-bold mb-1">언제가 가장 좋을까요? 🤔</h2>
            <p className="text-sm text-gray-500 mb-6">
                {selectedCount !== null ? (
                    <span className="text-primary font-bold">{selectedCount}명이 가능한 시간들이에요!</span>
                ) : (
                    "왼쪽 슬라이더를 위아래로 움직여서 확인해보세요!"
                )}
            </p>

            <div
                className="relative"
                ref={containerRef}
            >
                <div
                    className="h-56 w-full ml-3 relative touch-none"
                    ref={chartRef}
                    onPointerDown={handlePanDown}
                    onPointerMove={handlePanMove}
                    onPointerUp={handlePanUp}
                    onPointerLeave={handlePanUp}
                >
                    {/* Valid Drag Overlay (Vertical Slider) */}
                    <div
                        className="absolute top-2 -left-7 bottom-8 w-8 z-20 cursor-ns-resize flex flex-col items-center touch-none"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <div className="absolute top-0 bottom-0 w-1.5 bg-slate-100/80 rounded-full" />
                        <div
                            className="absolute bottom-0 w-1.5 bg-indigo-600/20 rounded-full transition-all duration-75"
                            style={{ height: `${((selectedCount ?? 0) / maxCount) * 100}%` }}
                        />
                        <div
                            className={`absolute w-6 h-6 bg-white rounded-full shadow-[0_2px_12px_rgba(79,70,229,0.25)] border-[2px] border-white ring-1 ring-indigo-100 flex items-center justify-center z-30 transition-transform duration-100 ${isDraggingSlider ? 'scale-110' : 'scale-100'}`}
                            style={{
                                bottom: `${((selectedCount ?? 0) / maxCount) * 100}%`,
                                transform: `translateY(50%)`
                            }}
                        >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <span className="text-[10px] font-extrabold text-indigo-600 pt-[1px]">{selectedCount ?? 0}</span>
                            </div>
                            {isDraggingSlider && <div className="absolute inset-0 rounded-full ring-2 ring-indigo-600 ring-offset-2 transition-all" />}
                        </div>
                    </div>

                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <AreaChart
                            data={visibleData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            onClick={handleChartClick}
                        >
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10, fill: '#64748B' }}
                                minTickGap={50}
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
                                stroke="#4f46e5"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                dot={<CustomizedDot />}
                                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2, fill: '#fff' }}
                                isAnimationActive={false} // Disable animation for smoother zoom/pan
                            />
                            {selectedCount !== null && (
                                <ReferenceLine y={selectedCount} stroke="#4f46e5" strokeDasharray="3 3" />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Horizontal Scrollbar / Zoom Indicator */}
                <div className="mt-2 h-4 w-full px-4 flex items-center justify-center">
                    <div
                        ref={scrollContainerRef}
                        className="w-full h-1.5 bg-gray-200 rounded-full relative cursor-pointer"
                    // Optional: Click on track to jump? simplify to just thumb drag for now
                    >
                        <div
                            className="absolute top-0 bottom-0 bg-gray-400 rounded-full cursor-grab active:cursor-grabbing hover:bg-gray-500 transition-colors"
                            style={{
                                left: `${(safeStartIndex / totalData) * 100}%`,
                                width: `${(safeVisibleCount / totalData) * 100}%`
                            }}
                            onPointerDown={handleScrollMouseDown}
                            onPointerMove={handleScrollMouseMove}
                            onPointerUp={handleScrollMouseUp}
                            onPointerLeave={handleScrollMouseUp}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
