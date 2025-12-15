
import { RankedSlot } from "../useConfirm";
import { cn } from "@repo/ui";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ScheduleRankListProps {
    slots: RankedSlot[];
    selectedSlotIndex: number | null;
    onSelect: (index: number) => void;
}

export function ScheduleRankList({ slots, selectedSlotIndex, onSelect }: ScheduleRankListProps) {
    const [expanded, setExpanded] = useState(false);

    if (slots.length === 0) {
        return (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 text-center text-gray-500 text-sm">
                조건에 맞는 일정이 없습니다.
            </div>
        );
    }

    const firstRank = slots[0];
    const otherRanks = slots.slice(1);

    const renderSlot = (slot: RankedSlot, index: number, isMain: boolean = false) => {
        const isSelected = selectedSlotIndex === index;
        return (
            <div
                key={index}
                className={cn(
                    "relative p-4 rounded-2xl border cursor-pointer transition-all",
                    isSelected
                        ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                        : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm",
                    isMain ? "shadow-md" : ""
                )}
                onClick={() => onSelect(index)}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            index === 0
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-600"
                        )}>
                            {index === 0 ? "👑 1순위" : `${slot.rank}순위`}
                        </span>
                        <div className={cn(
                            "font-bold text-lg",
                            isSelected ? "text-indigo-900" : "text-gray-800"
                        )}>
                            {slot.startTime} {slot.endTime && !slot.startTime.includes("~") ? `~ ${slot.endTime}` : ""}
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {slot.count}명 가능
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-3">
            {firstRank && renderSlot(firstRank, 0, true)}

            {otherRanks.length > 0 && (
                <div className="space-y-2 pt-2">
                    {expanded && otherRanks.map((slot, i) => renderSlot(slot, i + 1))}

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center justify-center w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-1" /> 접기
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-1" /> 다른 일정 더보기
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
