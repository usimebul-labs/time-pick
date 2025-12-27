import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { RankedSlot } from "../types";
import { useConfirmStore } from "../stores/useConfirmStore";
import { useWeeklyRecommendation } from "./useWeeklyRecommendation";
import { CalendarDetail, ParticipantSummary } from "@/app/actions/calendar";

interface UseConfirmRankingProps {
    calendar?: CalendarDetail | null;
    participants: ParticipantSummary[];
}

export function useConfirmRanking({ calendar, participants }: UseConfirmRankingProps) {
    const { selectedParticipantIds, duration } = useConfirmStore();

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

    return { rankedSlots };
}
