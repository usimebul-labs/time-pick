
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useConfirm } from "./useConfirm";
import { Loader2 } from "lucide-react";

export default function Confirm({ params: { id } }: { params: { id: string } }) {
    const {
        event,
        isLoading,
        participants,
        selectedParticipantIds,
        toggleParticipant,
        clearParticipants,
        duration,
        setDuration,
        selectedTime,
        setSelectedTime,
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

    if (!event) {
        return (
            <AppScreen>
                <div className="p-4">Event not found</div>
            </AppScreen>
        );
    }

    return (
        <AppScreen appBar={{ title: "일정 확정하기" }}>
            <div className="flex flex-col flex-1 bg-slate-50 text-slate-900 overflow-y-auto pb-24">
                <div className="flex-1 px-5 py-6 space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900 leading-tight">{event.title}</h1>
                        <p className="text-slate-500 text-sm">{event.description || "확정을 위해 세부 내용을 입력해주세요"}</p>
                    </div>

                    {/* 1. Participant List */}
                    <ParticipantSelector
                        participants={participants}
                        selectedIds={selectedParticipantIds}
                        onToggle={toggleParticipant}
                        onClear={clearParticipants}
                    />

                    {/* 2. Time/Duration Setting */}
                    {event.type === 'weekly' && <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>⏰</span> 소요시간
                        </h2>
                        <WeeklyTimeSelector
                            duration={duration}
                            onDurationChange={setDuration}
                        />
                    </section>}

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


                    {/* 2. Time/Duration Setting */}
                    {event.type === 'monthly' && <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>⏰</span> 시간 설정
                        </h2>
                        <MonthlyTimeSelector
                            time={selectedTime}
                            onTimeChange={setSelectedTime}
                        />
                    </section>}


                    {/* 4. Additional Info */}
                    <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>📝</span> 안내 사항
                        </h2>
                        <AdditionalInfoForm
                            info={additionalInfo}
                            onChange={setAdditionalInfo}
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
        </AppScreen>
    );
}

import { ParticipantSelector } from "./components/ParticipantSelector";
import { WeeklyTimeSelector } from "./components/WeeklyTimeSelector";
import { MonthlyTimeSelector } from "./components/MonthlyTimeSelector";
import { ScheduleRankList } from "./components/ScheduleRankList";
import { AdditionalInfoForm } from "./components/AdditionalInfoForm";
