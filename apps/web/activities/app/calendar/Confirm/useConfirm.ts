
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

    // Ranking Logic
    const rankedSlots = useMemo<RankedSlot[]>(() => {
        if (!event || participants.length === 0) return [];

        // 1. Map all slots to available participants
        // Map: Slot Key -> Set<ParticipantID>
        const slotMap: Record<string, Set<string>> = {};

        participants.forEach(p => {
            p.availabilities.forEach(iso => {
                if (!iso) return;
                let key = iso;
                if (event.type === 'monthly') {
                    key = iso.split('T')[0]!; // YYYY-MM-DD only
                }

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

        if (event.type === 'monthly') {
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
                    startTime: date,
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

        } else {
            // Weekly Logic
            // Need consecutive slots of 'duration' (hours)
            // 1 hour = 2 slots (assuming 30 mins)
            const slotsRequired = duration * 2;
            const slotTimestamps = sortedKeys.map(k => new Date(k).getTime());

            const ranges: RankedSlot[] = [];

            for (let i = 0; i < slotTimestamps.length; i++) {
                // Define window [i, i+1, ..., i+slotsRequired-1]
                const windowIndices: number[] = [];
                let validSequence = true;

                for (let j = 0; j < slotsRequired; j++) {
                    const idx = i + j;
                    if (idx >= slotTimestamps.length) {
                        validSequence = false;
                        break;
                    }
                    // Check continuity (30m steps)
                    if (j > 0) {
                        const prev = slotTimestamps[i + j - 1]!;
                        const curr = slotTimestamps[idx]!;
                        if (curr !== prev + 30 * 60 * 1000) {
                            validSequence = false;
                            break;
                        }
                    }
                    windowIndices.push(idx);
                }

                if (!validSequence) continue; // Skip to next i

                // Calculate intersection for this window
                // Start with participants of first slot
                const firstKey = sortedKeys[i]!;
                let interactionSet = new Set(getParticipantsForSlot(firstKey));

                // Intersect with remaining slots in window
                for (let j = 1; j < windowIndices.length; j++) {
                    const key = sortedKeys[windowIndices[j]!]!;
                    const slotParticipants = getParticipantsForSlot(key);

                    // Intersection
                    for (const id of interactionSet) {
                        if (!slotParticipants.has(id)) {
                            interactionSet.delete(id);
                        }
                    }
                    if (interactionSet.size === 0) break;
                }

                // If InteractionSet empty, no shared availability for this range
                if (interactionSet.size === 0) continue;

                // Check Selection Constraint
                if (isSelectedMode) {
                    let hasAllSelected = true;
                    for (const id of selectedParticipantIds) {
                        if (!interactionSet.has(id)) {
                            hasAllSelected = false;
                            break;
                        }
                    }
                    if (!hasAllSelected) continue; // This range doesn't work for selected group
                }

                const startDate = new Date(slotTimestamps[i]!); // Use ! assertion as i is within bounds
                const endDate = new Date(slotTimestamps[i]! + duration * 60 * 60 * 1000);

                // Format: "MM/dd HH:mm"
                const formatted = format(startDate, "MM/dd HH:mm") + " ~ " + format(endDate, "HH:mm");

                ranges.push({
                    rank: 0,
                    startTime: formatted,
                    endTime: endDate.toISOString(),
                    startISO: startDate.toISOString(),
                    endISO: endDate.toISOString(),
                    participants: Array.from(isSelectedMode ? selectedParticipantIds : interactionSet), // If selected mode, we essentially confirm the *selected* people can make it. If recommendation mode, we confirm *whoever* is in interactionSet.
                    // Actually, even in selected mode, we might want to show if *more* people can make it? 
                    // Requirement: "Recommend slots with most participants if no selection".
                    // If selection exists, usually we focus on that group.
                    // Let's stick to returning the full set of available people for that slot, it's more informative.
                    count: isSelectedMode ? interactionSet.size : interactionSet.size // Always use actual available count for sorting
                    // Wait, if I use interactionSet for participants list, make sure to update `participants` field too.
                });

                // Fix participants field to be interactionSet for correct display of "Who is available"
                ranges[ranges.length - 1]!.participants = Array.from(interactionSet);
            }

            // Sort ranges
            ranges.sort((a, b) => {
                // Primary: Count DESC
                if (b.count !== a.count) return b.count - a.count;
                // Secondary: Time ASC
                return a.startISO.localeCompare(b.startISO);
            });

            return ranges.map((r, i) => ({ ...r, rank: i + 1 }));
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
            const combinedStart = new Date(`${selectedSlot.startISO}T${selectedTime}:00`);
            finalStart = combinedStart.toISOString();

            if (selectedEndTime) {
                const combinedEnd = new Date(`${selectedSlot.startISO}T${selectedEndTime}:00`);
                finalEnd = combinedEnd.toISOString();
            } else {
                finalEnd = undefined; // Or handle as null? confirmEvent action likely expects string | undefined
            }
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
