import { EventDetail } from "@/app/actions/calendar";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { format } from "date-fns";
import { AlignLeft, Calendar as CalendarIcon, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";

interface EventDetailsProps {
    event: EventDetail;
}

export function EventDetails({ event }: EventDetailsProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const getDeadlineInfo = () => {
        if (!event?.deadline) return null;
        const deadlineDate = parseISO(event.deadline);
        const diff = differenceInCalendarDays(deadlineDate, new Date());

        let dDayText = "";
        if (diff < 0) dDayText = "마감됨";
        else if (diff === 0) dDayText = "D-Day";
        else dDayText = `D-${diff}`;

        return { deadlineDate, dDayText };
    };

    const deadlineInfo = getDeadlineInfo();

    return (
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
    );
}
