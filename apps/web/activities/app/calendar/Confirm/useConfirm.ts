
import { useCalendarQuery } from "@/common/hooks/useCalendarQuery";
import { useCallback, useMemo, useState } from "react";
import { useFlow } from "@/stackflow";
import { ParticipantSummary } from "@/app/actions/calendar";
import { addMinutes, eachDayOfInterval, format, parseISO } from "date-fns";
import { confirmCalendar } from "@/app/actions/calendar";
import { formatISO } from "date-fns";

import { useWeeklyRecommendation } from "./hooks/useWeeklyRecommendation";
import { RankedSlot } from "./types";

// Removed local RankedSlot definition to avoiding conflict with imported type


export function useConfirm(id: string) {
    const { data, isLoading } = useCalendarQuery(id);
    const calendar = data?.calendar;
    const participants = data?.participants || [];

    // State
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<Set<string>>(new Set());
    // For weekly: duration in hours. Default 1.
    const [duration, setDuration] = useState<number>(1);
    // For monthly: specific time string "HH:mm"
    const [selectedTime, setSelectedTime] = useState<string>("12:00"); // Start Time
    const [selectedEndTime, setSelectedEndTime] = useState<string>(""); // End Time (optional)

    const [selectedRankIndex, setSelectedRankIndex] = useState<number | null>(0); // Default to 1st rank

    // Additional Info State
    const [additionalInfo, setAdditionalInfo] = useState<{
        location: string;
        transport: string;
        parking: string;
        fee: string;
        bank: string;
        inquiry: string;
        memo: string;
    }>({
        location: "", // Can implement pre-fill from event description if parsed
        transport: "",
        parking: "",
        fee: "",
        bank: "",
        inquiry: "",
        memo: ""
    });

    const { replace } = useFlow();

    // Initialize selected participants - default to ALL
    const initializedRef = useMemo(() => {
        if (participants.length > 0 && selectedParticipantIds.size === 0) {
            return false;
        }
        return true;
    }, [participants, selectedParticipantIds]);

    if (!initializedRef && participants.length > 0) {
        // This is a side effect in render, strictly speaking bad practice but common for initializing from data.
        // Better to use useEffect.
    }

    // Logic for toggling participants
    const toggleParticipant = useCallback((id: string) => {
        setSelectedParticipantIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const clearParticipants = useCallback(() => {
        setSelectedParticipantIds(new Set());
    }, []);

    // Weekly Recommendation Hook
    const weeklyRankedSlots = useWeeklyRecommendation({
        calendar,
        participants,
        selectedParticipantIds,
        duration
    });

    // Ranking Logic
    const rankedSlots = useMemo<RankedSlot[]>(() => {
        if (!calendar || participants.length === 0) return [];

        if (calendar.type === 'weekly') {
            return weeklyRankedSlots;
        }

        // Monthly Logic
        // 1. Map all slots to available participants
        // Map: Slot Key -> Set<ParticipantID>
        const slotMap: Record<string, Set<string>> = {};

        participants.forEach(p => {
            p.availabilities.forEach(iso => {
                if (!iso) return;
                // For monthly, we group by Date (YYYY-MM-DD)
                const key = iso.split('T')[0]!;

                if (!slotMap[key]) {
                    slotMap[key] = new Set();
                }
                slotMap[key]!.add(p.id);
            });
        });

        // Helper to get participants for a specific slot key
        const getParticipantsForSlot = (key: string): Set<string> => slotMap[key] || new Set();

        const sortedKeys = Object.keys(slotMap).sort(); // Ascending time

        // Filter valid slots based on selection state
        // If selection exists: Slot must contain ALL selected participants.
        // If no selection: All slots are candidates.
        const isSelectedMode = selectedParticipantIds.size > 0;

        const candidates = sortedKeys.map(date => {
            const availableSet = getParticipantsForSlot(date);

            // Logic:
            // 1. Calculate intersection with "Universe" (selectedIds or All)
            // 2. If Selection Mode: Intersection must size == selectedIds.size
            // 3. If Recommendation Mode: Just count size of availableSet (which is effectively intersection with All)

            let matches = false;
            let count = 0;
            let participantIds: string[] = [];

            if (isSelectedMode) {
                // Check if all selected are present
                matches = true;
                for (const id of selectedParticipantIds) {
                    if (!availableSet.has(id)) {
                        matches = false;
                        break;
                    }
                }
                if (matches) {
                    count = availableSet.size;
                    participantIds = Array.from(availableSet);
                }
            } else {
                // No selection -> everyone available in this slot is a candidate group
                matches = availableSet.size > 0;
                count = availableSet.size;
                participantIds = Array.from(availableSet);
            }

            if (!matches) return null;

            return {
                rank: 0,
                startTime: format(parseISO(date), "yyyy.MM.dd"),
                startISO: date,
                participants: participantIds,
                count
            };
        }).filter((item): item is RankedSlot => item !== null);

        // Sort logic
        candidates.sort((a, b) => {
            // Primary: Count DESC
            if (b.count !== a.count) return b.count - a.count;
            // Secondary: Time ASC (already sorted by keys, but map/filter preserves order usually? Array sort is robust)
            return a.startTime.localeCompare(b.startTime);
        });

        return candidates.map((c, i) => ({ ...c, rank: i + 1 }));

    }, [calendar, participants, selectedParticipantIds, weeklyRankedSlots]);

    const handleConfirm = async () => {
        if (!calendar || selectedRankIndex === null) return;

        const selectedSlot = rankedSlots[selectedRankIndex];
        if (!selectedSlot) return; // Should not happen

        let finalStart = selectedSlot.startISO;
        let finalEnd = selectedSlot.endISO;

        if (calendar.type === 'monthly') {
            // Combine date (YYYY-MM-DD) with selectedTime (HH:mm)
            const combinedStart = new Date(`${selectedSlot.startISO}T${selectedTime}:00`);
            finalStart = combinedStart.toISOString();

            if (selectedEndTime) {
                const combinedEnd = new Date(`${selectedSlot.startISO}T${selectedEndTime}:00`);
                finalEnd = combinedEnd.toISOString();
            } else {
                finalEnd = undefined; // Or handle as null? confirmCalendar action likely expects string | undefined
            }
        }

        const result = await confirmCalendar(id, {
            startTime: finalStart,
            endTime: finalEnd
        }, selectedSlot.participants, additionalInfo);

        if (result.success) {
            replace("Result", { id });
        } else {
            alert(result.error || "Failed to confirm event");
        }
    };

    return {
        calendar,
        participants,
        isLoading,
        selectedParticipantIds,
        toggleParticipant,
        clearParticipants,
        duration,
        setDuration,
        selectedTime, // Start Time
        setSelectedTime,
        selectedEndTime, // End Time
        setSelectedEndTime,
        additionalInfo,
        setAdditionalInfo,
        rankedSlots,
        selectedRankIndex,
        setSelectedRankIndex,
        handleConfirm
    };
}
