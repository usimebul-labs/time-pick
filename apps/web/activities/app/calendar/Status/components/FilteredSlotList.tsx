import { Clock } from "lucide-react";
import { ChartDataPoint } from "../useStatus";

interface FilteredSlotListProps {
    selectedCount: number | null;
    chartData: ChartDataPoint[];
    onClear: () => void;
}

export function FilteredSlotList({ selectedCount, chartData, onClear }: FilteredSlotListProps) {
    if (selectedCount === null) return null;

    const filteredData = chartData.filter(d => d.count === selectedCount);

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
            <div className="grid grid-cols-2 gap-2">
                {filteredData.length > 0 ? (
                    filteredData.map((d) => (
                        <div key={d.time} className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                            <span className="text-sm font-bold text-gray-800">{d.time}</span>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
                        해당 인원이 가능한 시간이 없어요 🥲
                    </div>
                )}
            </div>
        </div>
    );
}
