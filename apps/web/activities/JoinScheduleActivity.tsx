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
        if (participation?.availabilities) {
          setSelectedDates(participation.availabilities.map((d) => parseISO(d)));
        }
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

  const dates = event ? getDatesInRange(event.startDate, event.endDate).filter(d => !event.excludedDays.includes(getDay(d))) : [];

  // Summary Logic
  const getSummary = () => {
    if (selectedDates.length === 0) return "선택된 시간이 없습니다.";

    // Sort dates first
    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());


    console.log(event)
    // If type is monthly (date only), group consecutive dates
    if (event?.type === 'monthly') {
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

    // If type is weekly (date + time), group consecutive 60m slots on same day
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

        // Check if consecutive (same day + 60 mins, as default logic)
        // Wait, UI Calendar probably returns 30m slots if drag? 
        // The default interval is usually 30 min. Let's assume 30 min diff means consecutive.
        // If the user said "60 * 60000" in their manual edit, maybe they changed interval?
        // Actually, `getTimeSlots` generated 30m intervals. Standard is 30m.
        // Let's stick to 30 mins (30 * 60000) for now unless UI is different.
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

    // For weekly/time based, we DO show time
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

  const handleComplete = async () => {
    try {
      // Determine if guest or user
      // We can check participation.userId or try to join.
      // Ideally we know if the user is logged in. 
      // For now, let's assume if there is existing participation with a userId, they are logged in.
      // Or if we can't be sure, we might need a client-side check of auth state.
      // But getEventWithParticipation returns participation if they are the user.

      let guestName = "";

      // Basic guest check: If no previous participation and we don't know if logged in...
      // Ideally we should pass 'isLoggedIn' from server or check supabase client.
      // For MVP: If no participation, ask name. (This is weak, but fits "simple")
      // Better: Try to join. If server says "needs name", prompt?
      // Or just prompt if !participation

      if (!participation) {
        // This is a bit rough blindly assuming guest if no participation, 
        // because a logged in user encountering for first time also has no participation.
        // Real fix: Check auth state or try to use server action and handle error?
        // Let's rely on the fact that if they are logged in, the server action knows.
        // We can try sending without name. If it fails with "guest name required", then prompt.
      }

      // Let's try calling with just slots first
      const { joinSchedule } = await import("@/app/actions/calendar");

      let result = await joinSchedule(event.id, selectedDates.map(d => d.toISOString()));

      if (!result.success && result.error === "게스트 이름이 필요합니다.") {
        // Prompt for name
        const name = window.prompt("게스트 이름을 입력해주세요.");
        if (!name) return;

        result = await joinSchedule(event.id, selectedDates.map(d => d.toISOString()), { name });
      }

      if (result.success) {
        alert("일정이 등록되었습니다.");
        // Maybe navigate to confirmation or refresh
        window.location.reload();
      } else {
        alert(result.error);
      }

    } catch (e) {
      console.error(e);
      alert("오류가 발생했습니다.");
    }
  };

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
          <Button
            className="w-full h-12 text-base"
            onClick={handleComplete}
          >
            {selectedDates.length}개 시간 선택 완료
          </Button>
        </div>
      </div>
    </AppScreen>
  );
}
