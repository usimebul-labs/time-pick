import { ActivityLayout } from "@/common/components/ActivityLayout";
import { Loader2 } from "lucide-react";
import { useConfirmInit } from "./hooks/useConfirmInit";
import { useConfirmRanking } from "./hooks/useConfirmRanking";
import { useConfirmForm } from "./hooks/useConfirmForm";
import { useConfirmStore } from "./stores/useConfirmStore";

import { AdditionalInfoForm } from "./components/AdditionalInfoForm";
import { LocationSearchDialog } from "./components/LocationSearchDialog";
import { ParticipantSelector } from "./components/ParticipantSelector";
import { ScheduleRankList } from "./components/ScheduleRankList";
import { WeeklyTimeSelector } from "./components/WeeklyTimeSelector";

export default function Confirm({ params: { id } }: { params: { id: string } }) {
    const { calendar, participants, isLoading } = useConfirmInit(id);
    const { rankedSlots } = useConfirmRanking({ calendar, participants });
    const { handleConfirm } = useConfirmForm({ id, calendar, rankedSlots });

    // Read directly from store for computing derived UI state
    const { selectedRankIndex } = useConfirmStore();

    if (isLoading) {
        return (
            <ActivityLayout>
                <div className="flex flex-col items-center justify-center flex-1 h-full">
                    <Loader2 className="animate-spin text-muted-foreground" />
                </div>
            </ActivityLayout>
        );
    }

    if (!calendar) {
        return (
            <ActivityLayout>
                <div className="p-4">Calendar not found</div>
            </ActivityLayout>
        );
    }

    return (
        <ActivityLayout appBar={{ title: "일정 확정하기" }} className="bg-slate-50 text-slate-900">
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
                            highlightedIds={
                                selectedRankIndex !== null && rankedSlots[selectedRankIndex]
                                    ? rankedSlots[selectedRankIndex]!.participants
                                    : undefined
                            }
                        />
                    </section>

                    {/* 2. Duration Setting */}
                    {calendar.type === 'weekly' &&
                        <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span>⏰</span> 소요시간
                            </h2>
                            <WeeklyTimeSelector />
                        </section>
                    }

                    {/* 3. Ranked Schedules */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold px-1 flex items-center gap-2">
                            <span>📅</span> 추천 일정
                        </h2>
                        <ScheduleRankList slots={rankedSlots} />
                    </section>


                    {/* 4. Additional Info (Includes Time for Monthly) */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>📝</span> 기타 안내 사항
                        </h2>
                        <AdditionalInfoForm />
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

            <LocationSearchDialog />
        </ActivityLayout>
    );
}

