
import { useEventQuery } from "@/hooks/queries/useEventQuery";
import { useCallback, useMemo, useState } from "react";
import { useFlow } from "@/stackflow";
import { ParticipantSummary } from "@/app/actions/calendar";
import { addMinutes, eachDayOfInterval, format, parseISO } from "date-fns";
import { confirmEvent } from "@/app/actions/calendar";
import { formatISO } from "date-fns";

export type RankedSlot = {
    rank: number;
    startTime: string; // Formatted for display
    endTime?: string; // Formatted or raw? Let's use startISO/endISO for logic
    startISO: string;
    endISO?: string;
    participants: string[];
    count: number;
};

export function useConfirm(id: string) {
    const { data, isLoading } = useEventQuery(id);
    const event = data?.event;
    const participants = data?.participants || [];

    // State
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<Set<string>>(new Set());
    // For weekly: duration in hours. Default 1.
    const [duration, setDuration] = useState<number>(1);
    // For monthly: specific time string "HH:mm"
    const [selectedTime, setSelectedTime] = useState<string>("12:00");
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
        customFields: { label: string; value: string }[];
    }>({
        location: "", // Can implement pre-fill from event description if parsed
        transport: "",
        parking: "",
        fee: "",
        bank: "",
        inquiry: "",
        memo: "",
        customFields: []
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

    const selectAllParticipants = useCallback(() => {
        if (selectedParticipantIds.size === participants.length) {
            setSelectedParticipantIds(new Set());
        } else {
            setSelectedParticipantIds(new Set(participants.map(p => p.id)));
        }
    }, [participants, selectedParticipantIds]);

    // Ranking Logic
    const rankedSlots = useMemo<RankedSlot[]>(() => {
        if (!event || participants.length === 0) return [];

        const activeParticipants = participants.filter(p => selectedParticipantIds.has(p.id));
        if (activeParticipants.length === 0) return [];

        // 1. Collect all availability slots
        // Map: Slot Key (ISO/Date) -> Count of Selected Participants
        const slotCounts: Record<string, number> = {};

        // We only care about slots where ALL selected participants are available
        // But for robustness, let's count first.

        activeParticipants.forEach(p => {
            p.availabilities.forEach(iso => {
                if (!iso) return;
                // For Monthly, ISO is full datetime, but availability resolution is Date?
                // useStatus logic: if monthly, key is "MM/dd".
                // But standardized to "YYYY-MM-DD" for logic.
                let key = iso;
                if (event.type === 'monthly') {
                    key = iso.split('T')[0]!; // YYYY-MM-DD only
                }

                slotCounts[key] = (slotCounts[key] || 0) + 1;
            });
        });

        const targetCount = activeParticipants.length;
        const fullyAvailableSlots = Object.entries(slotCounts)
            .filter(([_, count]) => count === targetCount)
            .map(([key]) => key)
            .sort(); // Chronological sort because ISO strings sort correctly

        if (event.type === 'monthly') {
            // For Monthly: Rank slots are just Dates.
            // Requirement: "Time setting" is separate. 
            // So we return the Dates where everyone is available.
            return fullyAvailableSlots.map((date, index) => ({
                rank: index + 1,
                startTime: date, // YYYY-MM-DD
                startISO: date, // Logic will append selectedTime
                participants: activeParticipants.map(p => p.id),
                count: targetCount
            })).slice(0, 3);
        } else {
            // For Weekly: Need consecutive slots of 'duration' (hours)
            // 1 hour = 2 slots (assuming 30 mins)
            // But we don't know slot size for sure purely from here, but useStatus implies 30m.
            // Let's assume 30m slots.
            const slotsRequired = duration * 2;

            // Convert to Dates for arithmetic
            const sortedDates = fullyAvailableSlots.map(s => new Date(s).getTime());

            const ranges: RankedSlot[] = [];

            // Find sequences
            // We iterate through sorted slots.
            // We look for a sequence of length `slotsRequired` where diff is 30 mins.

            for (let i = 0; i < sortedDates.length; i++) {
                // Check if a sequence starting at i exists
                let validSequence = true;
                for (let j = 1; j < slotsRequired; j++) {
                    const nextIndex = i + j;
                    if (nextIndex >= sortedDates.length) {
                        validSequence = false;
                        break;
                    }

                    // sortedDates is number[], so values are valid numbers.
                    if (sortedDates[nextIndex] !== sortedDates[i]! + j * 30 * 60 * 1000) {
                        validSequence = false;
                        break;
                    }
                }

                if (validSequence) {
                    const startDate = new Date(sortedDates[i]!); // Use ! assertion as i is within bounds
                    const endDate = new Date(sortedDates[i]! + duration * 60 * 60 * 1000);

                    // Format: "MM/dd HH:mm"
                    const formatted = format(startDate, "MM/dd HH:mm") + " ~ " + format(endDate, "HH:mm");

                    ranges.push({
                        rank: 0, // Assigned later
                        startTime: formatted,
                        endTime: endDate.toISOString(), // Display purposes?
                        startISO: startDate.toISOString(),
                        endISO: endDate.toISOString(),
                        participants: activeParticipants.map(p => p.id),
                        count: targetCount
                    });
                }
            }

            // Rank by earliness (already sorted)
            return ranges.map((r, i) => ({ ...r, rank: i + 1 })).slice(0, 3);
        }

    }, [event, participants, selectedParticipantIds, duration]);

    const handleConfirm = async () => {
        if (!event || selectedRankIndex === null) return;

        const selectedSlot = rankedSlots[selectedRankIndex];
        if (!selectedSlot) return; // Should not happen

        let finalStart = selectedSlot.startISO;
        let finalEnd = selectedSlot.endISO;

        if (event.type === 'monthly') {
            // Combine date (YYYY-MM-DD) with selectedTime (HH:mm)
            // selectedSlot.startISO is YYYY-MM-DD string
            const combined = new Date(`${selectedSlot.startISO}T${selectedTime}:00`);
            finalStart = combined.toISOString();
            // End time is optional or derived? logic in confirmEvent can handle null end for monthly?
            // Or set to +1 hour default?
            // Let's set end as same for now or +1h?
            // If I leave undefined, confirmAction logic handles it (single date).
        }

        const result = await confirmEvent(id, {
            startTime: finalStart,
            endTime: finalEnd
        }, additionalInfo);

        if (result.success) {
            replace("Result", { id });
        } else {
            alert(result.error || "Failed to confirm event");
        }
    };

    return {
        event,
        participants,
        isLoading,
        selectedParticipantIds,
        toggleParticipant,
        selectAllParticipants,
        duration,
        setDuration,
        selectedTime,
        setSelectedTime,
        additionalInfo,
        setAdditionalInfo,
        rankedSlots,
        selectedRankIndex,
        setSelectedRankIndex,
        handleConfirm
    };
}
