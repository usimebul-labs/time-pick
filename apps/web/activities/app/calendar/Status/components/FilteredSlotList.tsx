import { ParticipantSummary } from "@/app/actions/calendar";
import { ParticipantGrid } from "@/common/components/participant/ParticipantGrid";
import { Clock } from "lucide-react";
import { ChartDataPoint } from "../useStatus";
import { useState } from "react";

interface FilteredSlotListProps {
    selectedCount: number | null;
    chartData: ChartDataPoint[];
    participants: ParticipantSummary[];
    onClear: () => void;
}

export function FilteredSlotList({ selectedCount, chartData, participants, onClear }: FilteredSlotListProps) {
    const [showAll, setShowAll] = useState(false);

    if (selectedCount === null) return null;

    const filteredData = chartData.filter(d => d.count === selectedCount);
    const visibleData = showAll ? filteredData : filteredData.slice(0, 3);
    const hasMore = filteredData.length > 3;

    return (
        <div className="p-5 pb-32">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-gray-900">{selectedCount}명이 되는 시간</span>
                    <span className="text-primary font-bold">
                        {filteredData.length}개
                    </span>
                </h2>
                <button
                    onClick={onClear}
                    className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
                >
                    필터 해제
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {filteredData.length > 0 ? (
                    <>
                        {visibleData.map((d) => {
                            // Find participants for this slot
                            const availableParticipants = participants.filter(p => d.availableParticipantIds.includes(p.id));
                            return (
                                <div key={d.time} className="flex p-4 bg-white border border-gray-100 rounded-xl shadow-sm gap-6">
                                    {/* Left: Info (Approx 2/7) */}
                                    <div className="flex flex-col justify-center min-w-0">
                                        <span className="text-sm font-bold text-gray-900">{d.time}</span>
                                    </div>

                                    {/* Right: Participants (Approx 5/7) */}
                                    <div className="flex">
                                        <ParticipantGrid
                                            participants={availableParticipants}
                                            interaction="readonly"
                                            className="gap-1"
                                            itemClassName="py-0.5 px-1.5 border-none bg-gray-50"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {hasMore && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="w-full py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                            >
                                {showAll ? "접기" : "더 보기"}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        해당 인원이 가능한 시간이 없어요 🥲
                    </div>
                )}
            </div>
        </div>
    );
}
