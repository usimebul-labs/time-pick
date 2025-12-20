import { EventDetail, ParticipantSummary } from "@/app/actions/calendar";
import { Calendar } from "@repo/ui";
import { useCalendarSection } from "../hooks/useCalendarSection";

interface CalendarSectionProps {
    event: EventDetail;
    participants: ParticipantSummary[];
}

export function CalendarSection({ event, participants }: CalendarSectionProps) {
    const { selectedDates, onSelectDates, selectedParticipantIds } = useCalendarSection();

    console.log(event)

    return (
        <div>
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
                onSelectDates={onSelectDates}
                participants={participants}
                selectedParticipantIds={selectedParticipantIds}
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
