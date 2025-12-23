import { useState } from "react";
import { AppBar } from "@/common/components/AppBar";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useFlow } from "@/stackflow";
import { Loader2, Home } from "lucide-react";
import { useConfirm } from "./useConfirm";

export default function Confirm({ params: { id } }: { params: { id: string } }) {
    const { replace, pop } = useFlow();
    const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
    const {
        calendar,
        isLoading,
        participants,
        selectedParticipantIds,
        toggleParticipant,
        clearParticipants,
        duration,
        setDuration,
        selectedTime,
        setSelectedTime,
        selectedEndTime,
        setSelectedEndTime,
        additionalInfo,
        setAdditionalInfo,
        rankedSlots,
        selectedRankIndex,
        setSelectedRankIndex,
        handleConfirm
    } = useConfirm(id);

    if (isLoading) {
        return (
            <AppScreen>
                <div className="flex flex-col items-center justify-center flex-1 h-full">
                    <Loader2 className="animate-spin text-muted-foreground" />
                </div>
            </AppScreen>
        );
    }

    if (!calendar) {
        return (
            <AppScreen>
                <div className="p-4">Calendar not found</div>
            </AppScreen>
        );
    }

    return (
        <AppScreen>
            <div className="flex flex-col h-full bg-slate-50 text-slate-900">
                <AppBar
                    title="일정 확정하기"
                    onBack={pop}
                    right={
                        <button
                            onClick={() => replace("Dashboard", {})}
                            className="p-1 -mr-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Home className="w-6 h-6" strokeWidth={1.5} />
                        </button>
                    }
                />

                <div className="flex-1 overflow-y-auto pb-24">
                    <div className="px-5 py-6 space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{calendar.title}</h1>
                            <p className="text-slate-500 text-sm">{calendar.description || "확정을 위해 세부 내용을 입력해주세요"}</p>
                        </div>

                        {/* 1. Participant List */}
                        <section className="space-y-4">
                            <ParticipantSelector
                                participants={participants}
                                selectedIds={selectedParticipantIds}
                                highlightedIds={
                                    selectedRankIndex !== null && rankedSlots[selectedRankIndex]
                                        ? rankedSlots[selectedRankIndex]!.participants
                                        : undefined
                                }
                                onToggle={toggleParticipant}
                                onClear={clearParticipants}
                            />
                        </section>

                        {/* 2. Duration Setting */}
                        {calendar.type === 'weekly' &&
                            <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span>⏰</span> 소요시간
                                </h2>
                                <WeeklyTimeSelector
                                    duration={duration}
                                    onDurationChange={setDuration}
                                />
                            </section>
                        }

                        {/* 3. Ranked Schedules */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold px-1 flex items-center gap-2">
                                <span>📅</span> 추천 일정
                            </h2>
                            <ScheduleRankList
                                slots={rankedSlots}
                                selectedSlotIndex={selectedRankIndex}
                                onSelect={setSelectedRankIndex}
                            />
                        </section>


                        {/* 4. Additional Info (Includes Time for Monthly) */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span>📝</span> 기타 안내 사항
                            </h2>
                            <AdditionalInfoForm
                                info={additionalInfo}
                                onChange={setAdditionalInfo}
                                monthlyTimeProps={calendar.type === 'monthly' ? {
                                    startTime: selectedTime,
                                    onStartTimeChange: setSelectedTime,
                                    endTime: selectedEndTime,
                                    onEndTimeChange: setSelectedEndTime
                                } : undefined}
                                onOpenLocationSearch={() => setIsLocationSearchOpen(true)}
                            />
                        </section>
                    </div>

                    {/* 5. Confirm Button */}
                    <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-100">
                        <button
                            onClick={handleConfirm}
                            disabled={selectedRankIndex === null || rankedSlots.length === 0}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
                        >
                            일정 확정하기
                        </button>
                    </div>
                </div>

                <LocationSearchDialog
                    isOpen={isLocationSearchOpen}
                    onClose={() => setIsLocationSearchOpen(false)}
                    onSelect={(location) => setAdditionalInfo({ ...additionalInfo, location })}
                />
            </div>
        </AppScreen>
    );
}

import { AdditionalInfoForm } from "./components/AdditionalInfoForm";
import { ParticipantSelector } from "./components/ParticipantSelector";
import { ScheduleRankList } from "./components/ScheduleRankList";
import { WeeklyTimeSelector } from "./components/WeeklyTimeSelector";
import { LocationSearchDialog } from "./components/LocationSearchDialog";

