import { useMemo } from "react";
import { format } from "date-fns";
import { ParticipantSummary } from "@/app/actions/calendar";
import { RankedSlot } from "../types";

// Helper to get participants for a specific slot key
const getParticipantsForSlot = (slotMap: Record<string, Set<string>>, key: string): Set<string> => slotMap[key] || new Set();

export function useWeeklyRecommendation({
    calendar,
    participants,
    duration,
    selectedParticipantIds,
}: {
    calendar: any; // Using any for now to avoid large type imports, or import Calendar type if available
    participants: ParticipantSummary[];
    selectedParticipantIds: Set<string>;
    duration: number;
}) {
    const rankedSlots = useMemo<RankedSlot[]>(() => {
        if (!calendar || participants.length === 0 || calendar.type !== 'weekly') return [];

        // 1. Map all slots to available participants
        // Map: Slot Key -> Set<ParticipantID>
        const slotMap: Record<string, Set<string>> = {};

        participants.forEach(p => {
            p.availabilities.forEach(iso => {
                if (!iso) return;
                // Weekly keys are exact ISO strings (or timestamps? logic used ISO in original)
                // Original logic used: 
                // key = iso; 
                // if (calendar.type === 'monthly') key = iso.split('T')[0]!;

                // Since this is ONLY weekly, we use full ISO
                const key = iso;

                if (!slotMap[key]) {
                    slotMap[key] = new Set();
                }
                slotMap[key]!.add(p.id);
            });
        });

        const sortedKeys = Object.keys(slotMap).sort(); // Ascending time


        // Filter valid slots based on selection state
        const isSelectedMode = selectedParticipantIds.size > 0;


        // Weekly Logic
        // Need consecutive slots of 'duration' (hours)
        const slotsRequired = duration;

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
                // Check continuity (1 hour steps)
                if (j > 0) {
                    const prev = slotTimestamps[i + j - 1]!;
                    const curr = slotTimestamps[idx]!;
                    if (curr !== prev + 60 * 60 * 1000) {
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
            let interactionSet = new Set(getParticipantsForSlot(slotMap, firstKey));

            // Intersect with remaining slots in window
            for (let j = 1; j < windowIndices.length; j++) {
                const key = sortedKeys[windowIndices[j]!]!;
                const slotParticipants = getParticipantsForSlot(slotMap, key);

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

            // Format: "yyyy.MM.dd\nHH:mm ~ HH:mm"
            const formatted = format(startDate, "yyyy.MM.dd") + "\n" + format(startDate, "HH:mm") + " ~ " + format(endDate, "HH:mm");

            ranges.push({
                rank: 0,
                startTime: formatted,
                endTime: endDate.toISOString(),
                startISO: startDate.toISOString(),
                endISO: endDate.toISOString(),
                participants: Array.from(interactionSet), // Ensure we return EVERYONE available in this slot
                count: interactionSet.size
            });
        }

        // Sort ranges
        ranges.sort((a, b) => {
            // Primary: Count DESC
            if (b.count !== a.count) return b.count - a.count;
            // Secondary: Time ASC
            return a.startISO.localeCompare(b.startISO);
        });

        return ranges.map((r, i) => ({ ...r, rank: i + 1 }));

    }, [calendar, participants, selectedParticipantIds, duration]);

    return rankedSlots;
}
