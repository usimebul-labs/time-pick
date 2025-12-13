"use client";

import { Button } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { AlertCircle } from "lucide-react";
import { useSelect } from "./hooks/useSelect";
import { CalendarSection } from "./components/CalendarSection";
import { ParticipantList } from "./components/ParticipantList";
import { EventDetails } from "./components/EventDetails";

export default function Select({ params: { id } }: { params: { id: string } }) {
    const {
        event,
        loading,
        error,
        participants,
        participation,
        selectedParticipantIds,
        selectedDates,
        deadlineInfo,
        setSelectedDates,
        toggleParticipant,
        handleComplete,
        handleSelectHighlighted
    } = useSelect(id);

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

    return (
        <AppScreen>
            <div className="flex flex-col h-full bg-white">
                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 pb-32">

                    {/* 1. Calendar Zone (Top Priority) */}
                    <CalendarSection
                        event={event}
                        selectedDates={selectedDates}
                        participants={participants}
                        selectedParticipantIds={selectedParticipantIds}
                        onSelectDates={setSelectedDates}
                    />

                    <div className="w-full h-px bg-gray-100 mt-3 mb-6"></div>

                    {/* 2. Participants Zone */}
                    <ParticipantList
                        participants={participants}
                        participation={participation}
                        selectedParticipantIds={selectedParticipantIds}
                        onToggleParticipant={toggleParticipant}
                        onSelectHighlighted={handleSelectHighlighted}
                    />

                    {/* 3. Details Zone (Collapsible) */}
                    <EventDetails
                        event={event}
                        deadlineInfo={deadlineInfo}
                    />
                </div>

                {/* Footer Summary */}
                <div className="border-t bg-white p-4 shadow-lg z-20 sticky bottom-0">
                    <Button
                        className="w-full h-12 text-base"
                        onClick={handleComplete}
                    >
                        {selectedDates.length}개 시간 선택 완료
                    </Button>
                </div>
            </div>
        </AppScreen >
    );
}
