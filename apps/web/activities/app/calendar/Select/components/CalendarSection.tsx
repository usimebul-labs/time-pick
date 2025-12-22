import React from "react";
import { CalendarDetail, ParticipantSummary } from "@/app/actions/calendar";
import { Calendar } from "@repo/ui";
import { useCalendarSection } from "../hooks/useCalendarSection";

interface CalendarSectionProps {
    calendar: CalendarDetail;
    participants: ParticipantSummary[];
}

export function CalendarSection({ calendar, participants }: CalendarSectionProps) {
    const { selectedDates, onSelectDates, selectedParticipantIds } = useCalendarSection();

    // Memoize derived props to prevent unnecessary re-renders of the Calendar component
    // especially during drag selection updates which trigger this component to re-render.
    const startDate = React.useMemo(() => new Date(calendar.startDate), [calendar.startDate]);
    const endDate = React.useMemo(() => new Date(calendar.endDate), [calendar.endDate]);
    const disabledDates = React.useMemo(() =>
        calendar.excludedDates.map(d => new Date(d)),
        [calendar.excludedDates]
    );
    const startHour = React.useMemo(() =>
        calendar.startTime ? parseInt(calendar.startTime.split(':')[0]!) : undefined,
        [calendar.startTime]
    );
    const endHour = React.useMemo(() =>
        calendar.endTime ? parseInt(calendar.endTime.split(':')[0]!) : undefined,
        [calendar.endTime]
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                    {calendar.type === 'monthly' ? "언제 시간이 되시나요?" : "가능한 시간을 알려주세요"}
                </h2>
            </div>

            <Calendar
                type={calendar.type}
                startDate={startDate}
                endDate={endDate}
                excludedDays={calendar.excludedDays}
                startHour={startHour}
                endHour={endHour}
                selectedDates={selectedDates}
                onSelectDates={onSelectDates}
                participants={participants}
                selectedParticipantIds={selectedParticipantIds}
                disableHolidays={calendar.excludeHolidays}
                disabledDates={disabledDates}
            />

            <div className="flex justify-end mt-2 h-6">
                {selectedDates.length > 0 && (
                    <button
                        onClick={() => onSelectDates([])}
                        className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center px-2 py-1 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        <span className="mr-1">↺</span>
                        전체 선택 해제
                    </button>
                )}
            </div>
        </div>
    );
}
