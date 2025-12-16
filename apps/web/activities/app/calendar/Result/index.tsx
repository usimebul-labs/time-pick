
'use client';

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useResult } from "./useResult";
import { Loader2, Share2, Calendar, MapPin, ExternalLink, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, cn } from "@repo/ui";
import { useFlow } from "@/stackflow";
import { useState } from "react";

export default function Result({ params: { id } }: { params: { id: string } }) {
    const { event, participants, isLoading, error, handleShare } = useResult(id);
    const { push, replace } = useFlow();
    const [isCopied, setIsCopied] = useState(false);

    if (isLoading) {
        return (
            <AppScreen>
                <div className="flex flex-col items-center justify-center flex-1 h-screen bg-[#F8F9FA]">
                    <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
                </div>
            </AppScreen>
        );
    }

    if (error || !event) {
        return (
            <AppScreen>
                <div className="flex flex-col items-center justify-center flex-1 h-screen bg-slate-50 p-6 text-center">
                    <div className="text-xl font-bold text-slate-900 mb-2">일정을 찾을 수 없어요 😢</div>
                    <p className="text-slate-500">{error || "잘못된 접근입니다."}</p>
                    <button
                        onClick={() => replace("Dashboard", {})}
                        className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </AppScreen>
        );
    }

    // Parse additional info from description if it exists in the expected format
    const descriptionParts = event.description?.split('--- 확정 안내 ---') || [];
    const mainDescription = descriptionParts[0]?.trim();
    const additionalInfoText = descriptionParts[1]?.trim();

    const onShareClick = async () => {
        const success = await handleShare();
        if (success) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <AppScreen appBar={{ title: "일정 결과" }}>
            <div className="flex flex-col flex-1 bg-slate-50 text-slate-900 overflow-y-auto pb-32">
                {/* Header Section */}
                <div className="bg-white pb-8 pt-6 px-5 rounded-b-2xl shadow-sm mb-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">일정이 확정되었어요!</h1>
                    <p className="text-slate-500 text-sm">참여자들에게 공유해서 알려보세요</p>
                </div>

                <div className="px-5 space-y-4">
                    {/* Time Card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-bold">확정 일정</h2>
                        </div>
                        <div className="pl-7">
                            <div className="text-xl font-bold text-slate-900 mb-1">
                                {event.startDate}
                                {event.startDate !== event.endDate && ` ~ ${event.endDate}`}
                            </div>
                            <div className="text-base text-slate-600 font-medium">
                                {event.startTime}
                                {event.endTime && ` ~ ${event.endTime}`}
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Card (Location, etc.) */}
                    {additionalInfoText && (
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                <h2 className="text-lg font-bold">상세 안내</h2>
                            </div>
                            <div className="pl-7 whitespace-pre-wrap text-slate-600 text-sm leading-relaxed space-y-1">
                                {additionalInfoText.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Participants Card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">👥</span>
                            <h2 className="text-lg font-bold">함께하는 멤버 <span className="text-indigo-500 text-base ml-1">{participants.length}</span></h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {participants.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100"
                                >
                                    <Avatar className="h-5 w-5 mr-1.5">
                                        <AvatarImage src={p.avatarUrl || undefined} />
                                        <AvatarFallback className="text-[10px] bg-white text-slate-500">
                                            {p.name.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-slate-700 font-medium">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-100 flex gap-3">
                    <button
                        onClick={() => replace("Dashboard", {})}
                        className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors"
                    >
                        홈으로
                    </button>
                    <button
                        onClick={onShareClick}
                        className={cn(
                            "flex-1 py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2",
                            isCopied
                                ? "bg-green-500 text-white shadow-green-200"
                                : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                        )}
                    >
                        {isCopied ? (
                            <>
                                <CheckCircle className="w-5 h-5" />복사 완료!
                            </>
                        ) : (
                            <>
                                <Share2 className="w-5 h-5" />공유하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AppScreen>
    );
}
