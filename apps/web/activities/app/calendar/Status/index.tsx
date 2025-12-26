'use client';

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { FilteredSlotList } from "./components/FilteredSlotList";
import { ParticipantList } from "./components/ParticipantList";
import { StatusChart } from "./components/StatusChart";
import { StatusFooter } from "./components/StatusFooter";
import { useStatus } from "./useStatus";

import { HomeButton } from "@/common/components/HomeButton";
import { useFlow } from "@/stackflow";

export default function Status({ params: { id } }: { params: { id: string } }) {
    const {
        calendar,
        participants,
        loading,
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
        isLoggedIn
    } = useStatus(id);

    const { replace } = useFlow();

    if (loading) return (
        <ActivityLayout>
            <div className="flex justify-center items-center h-full bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        </ActivityLayout>
    );

    if (error || !calendar) return (
        <ActivityLayout>
            <div className="flex flex-col justify-center items-center h-full p-4 text-center bg-slate-50">
                <h2 className="text-lg font-bold mb-1 text-slate-900">오류가 발생했습니다</h2>
                <p className="text-slate-500">{error || "일정을 찾을 수 없습니다."}</p>
            </div>
        </ActivityLayout>
    );

    return (
        <ActivityLayout appBar={{ title: "일정 선택 현황" }}>
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
                <StatusChart
                    chartData={chartData}
                    maxCount={maxCount}
                    selectedCount={selectedCount}
                    setSelectedCount={setSelectedCount}
                    setSelectedSlot={setSelectedSlot}
                    selectedVipIds={selectedVipIds}
                    participants={participants}
                    calendar={calendar}
                />

                <div className="h-2 bg-gray-50 my-2" />

                {selectedCount !== null ? (
                    <FilteredSlotList
                        selectedCount={selectedCount}
                        chartData={chartData}
                        onClear={() => setSelectedCount(null)}
                    />
                ) : (
                    <ParticipantList
                        participants={participants}
                        selectedSlot={selectedSlot}
                        selectedVipIds={selectedVipIds}
                        onSlotClear={() => setSelectedSlot(null)}
                        onVipToggle={handleVipToggle}
                    />
                )}
            </div>

            <StatusFooter onEdit={handleEdit} onComplete={handleComplete} />
        </ActivityLayout>
    );
}
