import { useCalendarQuery } from "@/common/queries/useCalendarQuery";
import { ParticipantSummary } from "@/app/actions/calendar";
import { addMinutes, eachDayOfInterval, format, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useFlow } from "@/stackflow";

export type ChartDataPoint = {
    time: string;
    count: number;
    vipCount: number;
    // Original timestamp or date object might be useful if needed, but string key is fine for now
};

export type SelectedSlot = {
    time: string;
    count: number;
    availableParticipants: ParticipantSummary[];
};

export function useStatus(id: string) {
    // State for guest PIN
    const [guestPin, setGuestPin] = useState<string | undefined>(undefined);

    // Initial load of guest PIN
    useEffect(() => {
        const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
        setGuestPin(guestSessions[id]);
    }, [id]);

    const { data, isLoading, error: queryError } = useCalendarQuery(id, guestPin);

    const calendar = data?.calendar || null;
    const participants = data?.participants || [];
    const error = data?.error || queryError?.message || null;

    // Advanced Features State
    const [selectedVipIds, setSelectedVipIds] = useState<Set<string>>(new Set());
    const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
    const [selectedCount, setSelectedCount] = useState<number | null>(null);

    const { replace } = useFlow();

    const maxCount = useMemo(() => participants.length || 1, [participants]);

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
        if (!calendar) return [];

        const slotData: Record<string, { time: string, count: number, vipCount: number }> = {};
        const startDate = new Date(calendar.startDate);
        const endDate = new Date(calendar.endDate);

        // 1. Initialize all slots with 0
        if (calendar.type === 'monthly') {
            const allDays = eachDayOfInterval({ start: startDate, end: endDate });
            allDays.forEach(day => {
                const key = format(day, "MM/dd");
                slotData[key] = { time: key, count: 0, vipCount: 0 };
            });
        } else {
            if (calendar.startTime && calendar.endTime) {
                const startHour = parseInt(calendar.startTime.split(':')[0]!);
                const endHour = parseInt(calendar.endTime.split(':')[0]!);
                const allDays = eachDayOfInterval({ start: startDate, end: endDate });

                allDays.forEach(day => {
                    if (calendar.excludedDays.includes(day.getDay())) return;

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
                    if (calendar.type === 'monthly') {
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
    }, [calendar, participants, selectedVipIds]);

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

    return {
        calendar,
        participants,
        loading: isLoading,
        error,
        selectedVipIds,
        selectedSlot,
        setSelectedSlot,
        selectedCount,
        setSelectedCount,
        maxCount,
        chartData,
        handleVipToggle,
        handleEdit,
        handleComplete,
        isLoggedIn: data?.isLoggedIn || false
    };
}
