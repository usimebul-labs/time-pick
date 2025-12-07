'use client';

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useEffect, useState, useMemo } from "react";
import { getEventWithParticipation, EventDetail, ParticipantDetail } from "@/app/actions/calendar";
import { Button, Calendar } from "@repo/ui";
import { format, addDays, getDay, isSameDay, parseISO, startOfDay, addMinutes, setHours, setMinutes } from "date-fns";
import { ko } from "date-fns/locale";
import { Check, Clock, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

export default function JoinScheduleActivity({ params: { id } }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [participation, setParticipation] = useState<ParticipantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected slots (ISO strings)
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const { event, participation, error } = await getEventWithParticipation(id);
      console.log(event, participation, error);
      if (error) {
        setError(error);
      } else {
        setEvent(event);
        setParticipation(participation);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);


  // Helper to generate date range between start and end
  const getDatesInRange = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(current);
      current = addDays(current, 1);
    }
    return dates;
  };

  // Helper to generate time slots for a day
  const getTimeSlots = (date: Date, startTimeStr: string | null, endTimeStr: string | null) => {
    if (!startTimeStr || !endTimeStr) return [];

    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);

    let current = setMinutes(setHours(date, startH!), startM!);
    const end = setMinutes(setHours(date, endH!), endM!);

    const slots = [];
    while (current < end) { // < because slot is start time of 30m block
      slots.push(current);
      current = addMinutes(current, 30);
    }
    return slots;
  };

  const dates = event ? getDatesInRange(event.startDate, event.endDate).filter(d => !event.excludedDays.includes(getDay(d))) : [];

  // Summary Logic
  const getSummary = () => {
    if (selectedDates.length === 0) return "선택된 시간이 없습니다.";

    const sortedDates = Array.from(selectedDates).sort();

    // If date_only, group consecutive dates
    if (event?.type === 'monthly') {
      const ranges: string[] = [];
      let start: Date | null = null;
      let prev: Date | null = null;

      sortedDates.forEach((date, index) => {
        const current = date;
        if (!start) {
          start = current;
          prev = current;
          return;
        }

        // Check if consecutive (next day)
        if (isSameDay(current, addDays(prev!, 1))) {
          prev = current;
        } else {
          // Range ended
          pushRange(ranges, start!, prev!);
          start = current;
          prev = current;
        }
      });
      if (start && prev) {
        pushRange(ranges, start, prev);
      }
      return ranges.join(", ");
    }

    // If date_time, group consecutive 30m slots on same day
    else {
      const ranges: string[] = [];
      let start: Date | null = null;
      let prev: Date | null = null;

      sortedDates.forEach((date) => {
        const current = date;
        if (!start) {
          start = current;
          prev = current;
          return;
        }

        // Check if consecutive (same day + 60 mins)
        if (isSameDay(start, current) && current.getTime() === prev!.getTime() + 60 * 60000) {
          prev = current;
        } else {
          pushTimeRange(ranges, start!, prev!);
          start = current;
          prev = current;
        }
      });
      if (start && prev) pushTimeRange(ranges, start, prev);
      return ranges.join("\n");
    }
  };

  const pushRange = (ranges: string[], start: Date, end: Date) => {
    if (isSameDay(start, end)) {
      ranges.push(format(start, "M/d (eee)", { locale: ko }));
    } else {
      ranges.push(`${format(start, "M/d (eee)", { locale: ko })} ~ ${format(end, "M/d (eee)", { locale: ko })}`);
    }
  };

  const pushTimeRange = (ranges: string[], start: Date, end: Date) => {
    // End time is actually start of last slot + 30m
    const realEnd = addMinutes(end, 30);
    const dateStr = format(start, "M/d (eee)", { locale: ko });
    const timeStr = `${format(start, "HH:mm")} ~ ${format(realEnd, "HH:mm")}`;
    ranges.push(`${dateStr} ${timeStr}`);
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

  return (
    <AppScreen>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="p-4 border-b bg-white z-10 sticky top-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold break-all pr-2">{event.title}</h1>
              {event.description && <p className="text-sm text-gray-500 mt-1 lines-clamp-2">{event.description}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1.5" />
              <span>
                {event.startDate} ~ {event.endDate}
                {event.startTime && ` (${event.startTime} ~ ${event.endTime})`}
              </span>
            </div>
            {event.deadline && (
              <div className="flex items-center text-red-500">
                <Clock className="w-3 h-3 mr-1.5" />
                <span>마감: {format(parseISO(event.deadline), "M/d a h:mm", { locale: ko })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <h2 className="font-semibold mb-3 text-sm text-gray-700">
            {event.type === 'monthly'
              ? "가능한 날짜를 선택해주세요"
              : "가능한 시간을 선택해주세요 (드래그 가능 예정)"}
          </h2>
          <Calendar {...event} selectedDates={selectedDates} onSelectDates={setSelectedDates} />
        </div>

        {/* Footer Summary */}
        <div className="border-t bg-white p-4 shadow-lg z-20 sticky bottom-0">
          <div className="mb-3 max-h-24 overflow-y-auto bg-gray-50 p-2 rounded text-sm text-gray-700 whitespace-pre-line border cursor-text">
            {selectedDates.length > 0 ? getSummary() : <span className="text-gray-400">선택된 일정이 없습니다.</span>}
          </div>
          <Button className="w-full h-12 text-base">
            {selectedDates.length}개 시간 선택 완료
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}
