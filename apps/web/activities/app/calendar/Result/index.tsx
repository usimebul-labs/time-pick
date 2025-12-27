'use client';

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { Loader2 } from "lucide-react";
import { useFlow } from "@/stackflow";
import { useResultInit } from "./hooks/useResultInit";
import { ResultHeader } from "./components/ResultHeader";
import { ResultInfo } from "./components/ResultInfo";
import { ResultFooter } from "./components/ResultFooter";

export default function Result({ params: { id } }: { params: { id: string } }) {
    const { calendar, event, participants, isLoading, error } = useResultInit(id);
    const { replace } = useFlow();

    if (isLoading) {
        return (
            <ActivityLayout>
                <div className="flex flex-col items-center justify-center flex-1 h-full bg-[#F8F9FA]">
                    <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
                </div>
            </ActivityLayout>
        );
    }

    if (error || !calendar || !event) {
        return (
            <ActivityLayout>
                <div className="flex flex-col items-center justify-center flex-1 h-full bg-slate-50 p-6 text-center">
                    <div className="text-xl font-bold text-slate-900 mb-2">일정을 찾을 수 없어요 😢</div>
                    <p className="text-slate-500">{error || "잘못된 접근입니다."}</p>
                    <button
                        onClick={() => replace("Dashboard", {})}
                        className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </ActivityLayout>
        );
    }

    return (
        <ActivityLayout appBar={{ title: "일정 공유" }} className="bg-white text-slate-900">
            <div className="flex-1 overflow-y-auto pb-32">

                <ResultHeader
                    calendar={calendar}
                    event={event}
                    participants={participants}
                />

                <div className="h-2 bg-slate-50/50" />

                <ResultInfo message={event.message} />

                <ResultFooter id={id} />

            </div>
        </ActivityLayout>
    );
}
