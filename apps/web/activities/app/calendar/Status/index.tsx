'use client';

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { FilteredSlotList } from "./components/FilteredSlotList";
import { ParticipantList } from "./components/ParticipantList";
import { StatusChart } from "./components/StatusChart";
import { StatusFooter } from "./components/StatusFooter";
import { useStatus } from "./useStatus";

export default function Status({ params: { id } }: { params: { id: string } }) {
    const {
        event,
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
        handleComplete
    } = useStatus(id);

    if (loading) return (
        <AppScreen>
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        </AppScreen>
    );

    if (error || !event) return (
        <AppScreen>
            <div className="flex flex-col justify-center items-center h-screen p-4 text-center bg-slate-50">
                <h2 className="text-lg font-bold mb-1 text-slate-900">오류가 발생했습니다</h2>
                <p className="text-slate-500">{error || "일정을 찾을 수 없습니다."}</p>
            </div>
        </AppScreen>
    );

    return (
        <AppScreen appBar={{ title: event.title }}>
            <div className="flex flex-col h-full bg-white relative">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto pb-32">
                    <StatusChart
                        chartData={chartData}
                        maxCount={maxCount}
                        selectedCount={selectedCount}
                        setSelectedCount={setSelectedCount}
                        setSelectedSlot={setSelectedSlot}
                        selectedVipIds={selectedVipIds}
                        participants={participants}
                        event={event}
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
            </div>
        </AppScreen>
    );
}
