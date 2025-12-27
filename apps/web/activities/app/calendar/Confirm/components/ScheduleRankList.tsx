
import { RankedSlot } from "../types";
import { cn } from "@repo/ui";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { useConfirmStore } from "../stores/useConfirmStore";

interface ScheduleRankListProps {
    slots: RankedSlot[];
}

export function ScheduleRankList({ slots }: ScheduleRankListProps) {
    const { selectedRankIndex, setSelectedRankIndex } = useConfirmStore();
    const selectedSlotIndex = selectedRankIndex;
    const onSelect = setSelectedRankIndex;

    const [expanded, setExpanded] = useState(false);

    if (slots.length === 0) {
        return (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 text-center text-gray-500 text-sm">
                조건에 맞는 일정이 없습니다.
            </div>
        );
    }

    // Grouping by participant count
    // slots are already sorted by count DESC
    const groupedSlots: Record<number, RankedSlot[]> = {};
    const counts: number[] = [];

    slots.forEach(slot => {
        if (!groupedSlots[slot.count]) {
            groupedSlots[slot.count] = [];
            counts.push(slot.count);
        }
        groupedSlots[slot.count]!.push(slot);
    });

    const maxCount = counts[0];
    const otherCounts = counts.slice(1);

    const renderGroup = (count: number, groupSlots: RankedSlot[]) => {
        return (
            <div key={count} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {count}명 가능
                    </span>
                    {count === maxCount && <span className="text-xs text-indigo-600 font-medium">✨ 추천</span>}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {groupSlots.map((slot, i) => {
                        const originalIndex = slots.findIndex(s => s === slot); // Find original index for selection
                        const isSelected = selectedSlotIndex === originalIndex;

                        return (
                            <div
                                key={`${count}-${i}`}
                                onClick={() => onSelect(originalIndex)}
                                className={cn(
                                    "relative p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-center min-h-[50px]",
                                    isSelected
                                        ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500"
                                        : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                                )}
                            >
                                <div className={cn("font-bold text-center text-xs break-keep whitespace-pre-line", isSelected ? "text-indigo-900" : "text-gray-800")}>
                                    {slot.startTime} {slot.endTime && !slot.startTime.includes("~") ? `~ ${slot.endTime}` : ""}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Main Group (Max Count) */}
            {maxCount !== undefined && groupedSlots[maxCount] && renderGroup(maxCount, groupedSlots[maxCount])}

            {/* Other Groups (Collapsible) */}
            {otherCounts.length > 0 && (
                <div className="space-y-4">
                    {!expanded && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="flex items-center justify-center w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <ChevronDown className="w-4 h-4 mr-1" /> 다른 일정 더보기 ({otherCounts.reduce((acc, c) => acc + (groupedSlots[c]?.length || 0), 0)}개)
                        </button>
                    )}

                    {expanded && (
                        <div className="space-y-6 animation-fade-in">
                            {otherCounts.map(count => (
                                groupedSlots[count] && renderGroup(count, groupedSlots[count])
                            ))}

                            <button
                                onClick={() => setExpanded(false)}
                                className="flex items-center justify-center w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <ChevronUp className="w-4 h-4 mr-1" /> 접기
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
