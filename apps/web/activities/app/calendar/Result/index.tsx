
'use client';

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useResult } from "./useResult";
import { Loader2, Calendar, MapPin, Share2, Plus, ChevronDown, ChevronUp, Clock, Info } from "lucide-react";
import { cn, ShareCalendarDialog } from "@repo/ui";
import { useFlow } from "@/stackflow";
import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { SharedParticipantList, SharedParticipant } from "@/components/common/SharedParticipantList";

export default function Result({ params: { id } }: { params: { id: string } }) {
    const { event, confirmation, participants, isLoading, error } = useResult(id);
    const { replace } = useFlow();

    // UI States
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    if (isLoading) {
        return (
            <AppScreen>
                <div className="flex flex-col items-center justify-center flex-1 h-screen bg-[#F8F9FA]">
                    <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
                </div>
            </AppScreen>
        );
    }

    if (error || !event || !confirmation) {
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

    const { startAt, endAt, message } = confirmation;

    // Logic for Monthly All-Day check
    const sDate = new Date(startAt);
    const eDate = new Date(endAt);

    // We assume "All Day" if hours are 00:00 and 23:59.
    const isAllDay = sDate.getHours() === 0 && sDate.getMinutes() === 0 && eDate.getHours() === 23 && eDate.getMinutes() === 59;
    const isSameDay = sDate.getDate() === eDate.getDate() && sDate.getMonth() === eDate.getMonth();

    const dateStr = format(sDate, "yyyy년 M월 d일 EEEE", { locale: ko });
    let timeDisplay = "";

    if (isAllDay) {
        timeDisplay = "하루 종일"; // Or keep empty if design requires hiding it. User said "Basically don't show if all day".
        // If I want to strictly follow "굳이 표기하지마", I can make timeDisplay null or empty string and conditionally render.
    } else {
        const timeStr = format(sDate, "aaa h:mm", { locale: ko });
        const endTimeStr = format(eDate, "aaa h:mm", { locale: ko });
        if (isSameDay) {
            timeDisplay = `${timeStr} - ${endTimeStr}`;
        } else {
            const endDateStr = format(eDate, "M월 d일 (EEE)", { locale: ko });
            timeDisplay = `${timeStr} - ${endDateStr} ${endTimeStr}`;
        }
    }

    // Convert participants to SharedParticipant format
    const sharedParticipants: SharedParticipant[] = participants.map(p => ({
        id: p.id,
        name: p.name,
        avatarUrl: p.avatarUrl,
        userId: p.isGuest ? null : "user", // Rough mapping
        email: p.email,
        createdAt: p.createdAt,
        isGuest: p.isGuest
    }));

    // Check if any additional info exists
    const hasAdditionalInfo = message && Object.values(message).some(v => v);

    const InfoRow = ({ label, value }: { label: string, value?: string }) => {
        if (!value) return null;
        return (
            <div className="flex flex-col gap-1 py-2 border-b border-slate-50 last:border-0">
                <span className="text-xs font-bold text-slate-400">{label}</span>
                <span className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{value}</span>
            </div>
        );
    };

    return (
        <AppScreen appBar={{ title: "일정 공유", backButton: { onClick: () => replace("Dashboard", {}) } }}>
            <div className="flex flex-col flex-1 bg-white text-slate-900 overflow-y-auto pb-32">

                {/* 1. Header: Title & Description */}
                <div className="px-6 pt-8 pb-6">
                    <h1 className="text-xl font-bold text-slate-900 leading-tight mb-3">
                        {event.title}
                    </h1>
                    <div className="mb-4">
                        <div className="text-base font-bold text-slate-900">{dateStr}</div>
                        {/* Only show time if NOT all day */}
                        {!isAllDay && <div className="text-sm text-slate-600 font-medium">{timeDisplay}</div>}
                    </div>


                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-base font-bold text-slate-900">참여자</h2>
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {participants.length}
                            </span>
                        </div>

                        <SharedParticipantList
                            participants={sharedParticipants}
                            mode="grid"
                            interaction="readonly"
                            className="gap-2"
                            itemClassName="bg-white border border-slate-200 shadow-sm"
                        />
                    </div>

                    {event.description && (
                        <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    )}
                </div>

                <div className="h-2 bg-slate-50/50" />

                {/* 4. Additional Info (Collapsible) */}
                {hasAdditionalInfo && (
                    <div className="px-6 pb-6">
                        <button
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                            className="flex items-center justify-between w-full py-4 border-t border-slate-100 group"
                        >
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-slate-400" />
                                <span className="font-bold text-slate-900">기타 안내 사항</span>
                            </div>
                            {isInfoOpen ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                            )}
                        </button>

                        {isInfoOpen && (
                            <div className="bg-slate-50 rounded-xl p-5 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                <InfoRow label="📍 장소" value={message?.location} />
                                <InfoRow label="🚇 교통" value={message?.transport} />
                                <InfoRow label="🅿️ 주차" value={message?.parking} />
                                <InfoRow label="💰 회비" value={message?.fee} />
                                <InfoRow label="🏦 계좌" value={message?.bank} />
                                <InfoRow label="📞 문의" value={message?.inquiry} />
                                <InfoRow label="📝 메모" value={message?.memo} />
                            </div>
                        )}
                    </div>
                )}


                {/* Bottom Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-100 flex gap-3 z-50 safe-area-bottom">
                    <button
                        onClick={() => alert("준비 중인 기능입니다.")}
                        className="flex-2 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-base hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />캘린더에 추가
                    </button>
                    <button
                        onClick={() => setIsShareOpen(true)}
                        className="flex-[1.5] py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        공유하기
                    </button>
                </div>

                {/* Share Dialog */}
                <ShareCalendarDialog
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    link={typeof window !== 'undefined' ? window.location.href : ''}
                />
            </div>
        </AppScreen>
    );
}
