"use client";

import { EventDetail, getEventWithParticipation, ParticipantDetail, ParticipantSummary } from "@/app/actions/calendar";
import { Button, Calendar } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { AlertCircle, Calendar as CalendarIcon, Clock, User, AlignLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useFlow } from "../../../stackflow";

export default function Select({ params: { id } }: { params: { id: string } }) {
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [participation, setParticipation] = useState<ParticipantDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Selected slots (ISO strings)
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const { replace } = useFlow();

    useEffect(() => {
        const fetchEvent = async () => {
            // Get guest PIN
            const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
            const guestPin = guestSessions[id];

            const { event, participation, participants, isLoggedIn, error } = await getEventWithParticipation(id, guestPin);

            if (error) {
                setError(error);
            } else {
                // Redirect if not logged in and not a guest (no participation)
                if (!isLoggedIn && !participation) {
                    replace("GuestLogin", { id });
                    return;
                }

                setEvent(event);
                setParticipation(participation);

                // Sort participants: Me first, then others
                let sortedParticipants = participants || [];
                if (participation) {
                    const meIndex = sortedParticipants.findIndex(p => p.id === participation.id);
                    if (meIndex > -1) {
                        const me = sortedParticipants[meIndex];
                        if (me) {
                            const others = [...sortedParticipants];
                            others.splice(meIndex, 1);
                            sortedParticipants = [me, ...others];
                        }
                    }
                }
                setParticipants(sortedParticipants);
                setParticipants(sortedParticipants);
                // Default: No one selected (Show all stats)
                setSelectedParticipantIds([]);

                setIsLoggedIn(isLoggedIn);

                setIsLoggedIn(isLoggedIn);
                if (participation?.availabilities) {
                    setSelectedDates(participation.availabilities.map((d) => parseISO(d)));
                }
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id, replace]);


    const toggleParticipant = (id: string) => {
        setSelectedParticipantIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(pid => pid !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    if (loading) return (
        <AppScreen>
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </AppScreen>
    );

    if (error || !event) return (
        <AppScreen>
            <div className="flex flex-col justify-center items-center h-screen p-4 text-center bg-gray-50">
                <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                <h2 className="text-lg font-bold mb-1">오류가 발생했습니다</h2>
                <p className="text-gray-500">{error || "일정을 찾을 수 없습니다."}</p>
            </div>
        </AppScreen>
    );

    const handleComplete = async () => {
        try {
            const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
            const guestPin = guestSessions[id];

            if (!participation && !guestPin && !isLoggedIn) {
                alert("로그인이 필요합니다.");
                replace("GuestLogin", { id });
                return;
            }

            const { joinSchedule } = await import("@/app/actions/calendar");
            let result = await joinSchedule(event.id, selectedDates.map(d => d.toISOString()), { pin: guestPin });

            if (result.success) {
                alert("일정이 등록되었습니다.");
                replace("Confirmed", { id: event.id });
            } else {
                alert(result.error);
            }

        } catch (e) {
            console.error(e);
            alert("오류가 발생했습니다.");
        }
    };

    const getDeadlineInfo = () => {
        if (!event?.deadline) return null;
        const deadlineDate = parseISO(event.deadline);
        const diff = differenceInCalendarDays(deadlineDate, new Date());
        const isUrgent = diff <= 3 && diff >= 0;

        let dDayText = "";
        if (diff < 0) dDayText = "마감됨";
        else if (diff === 0) dDayText = "D-Day";
        else dDayText = `D-${diff}`;

        return { deadlineDate, isUrgent, dDayText };
    };

    const deadlineInfo = getDeadlineInfo();

    return (
        <AppScreen>
            <div className="flex flex-col h-full bg-white">
                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 pb-32">

                    {/* 1. Calendar Zone (Top Priority) */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                {event.type === 'monthly' ? "언제 시간이 되시나요?" : "가능한 시간을 알려주세요"}
                            </h2>
                        </div>
                        <Calendar
                            type={event.type}
                            startDate={new Date(event.startDate)}
                            endDate={new Date(event.endDate)}
                            excludedDays={event.excludedDays}
                            startHour={event.startTime ? parseInt(event.startTime.split(':')[0]!) : undefined}
                            endHour={event.endTime ? parseInt(event.endTime.split(':')[0]!) : undefined}
                            selectedDates={selectedDates}
                            onSelectDates={setSelectedDates}
                            participants={participants}
                            selectedParticipantIds={selectedParticipantIds}
                        />
                    </div>

                    <div className="w-full h-px bg-gray-100 my-6"></div>

                    {/* 2. Participants Zone */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-sm font-bold text-gray-800">
                                <User className="w-4 h-4 mr-1.5" />
                                <span>참여자 <span className="text-primary">{participants.length}</span>명</span>
                            </div>
                            {participants.length > 0 && <span className="text-xs text-gray-400">함께하고 있어요</span>}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {participants.length > 0 ? (
                                participants.map((p) => {
                                    const isMe = p.id === participation?.id;
                                    const isSelected = selectedParticipantIds.includes(p.id);

                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => toggleParticipant(p.id)}
                                            className={`flex items-center cursor-pointer transition-all duration-200 ${isSelected
                                                ? "bg-primary/5 border border-primary ring-1 ring-primary/20 shadow-sm opacity-100"
                                                : "bg-white border border-gray-200 hover:bg-gray-50"
                                                } rounded-full pl-1 pr-2.5 py-1 select-none hover:scale-105 active:scale-95`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 overflow-hidden ring-1 ring-white transition-colors duration-200 ${isSelected ? "bg-gradient-to-br from-primary/10 to-primary/20 text-primary" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                {p.avatarUrl ? (
                                                    <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    p.name[0]
                                                )}
                                            </div>
                                            <span className={`text-xs font-medium transition-colors duration-200 ${isSelected ? "text-primary font-bold" : "text-gray-700"}`}>
                                                {p.name}
                                                {isMe && <span className={`text-[10px] ml-0.5 ${isSelected ? "text-primary font-bold" : "text-gray-400"}`}>(나)</span>}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center w-full py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    <span className="text-xs text-gray-400">첫 번째 참여자가 되어주세요!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Details Zone (Collapsible) */}
                    <div className="bg-gray-50 rounded-xl border border-gray-100/80 overflow-hidden transition-all duration-300">
                        <div
                            className="bg-gray-50 p-5 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        >
                            <h3 className="text-base font-bold text-gray-700 uppercase tracking-wider flex items-center">
                                {event.title}
                                <span className="ml-2 text-xs font-normal text-gray-400 normal-case tracking-normal">(상세 보기)</span>
                            </h3>
                            {isDetailsOpen ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </div>

                        {/* Collapsible Content */}
                        {isDetailsOpen && (
                            <div className="px-5 pb-5 space-y-3 border-t border-gray-200/50 pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Description */}
                                {event.description && (
                                    <div className="flex items-start">
                                        <AlignLeft className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>
                                )}

                                {/* Date/Time */}
                                {event.startDate && event.endDate && (
                                    <div className="flex items-start">
                                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-gray-700">
                                            <div className="font-medium">
                                                {event.startDate} ~ {event.endDate}
                                            </div>
                                            {event.startTime && (
                                                <div className="text-gray-500 text-xs mt-1">
                                                    {event.startTime} ~ {event.endTime}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Deadline */}
                                {deadlineInfo && (
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                            <span>{format(deadlineInfo.deadlineDate, "M/d HH:mm")} 마감</span>
                                            <span className="mx-1.5 opacity-30">|</span>
                                            <span>{deadlineInfo.dDayText}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AppScreen >
    );
}
