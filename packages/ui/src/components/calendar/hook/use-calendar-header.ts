import { addMonths, addWeeks, endOfWeek, isAfter, isBefore, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";
import { useState } from "react";



export interface CalendarHeaderProps {
  startDate?: Date;
  endDate?: Date;
  type: 'monthly' | 'weekly';
}

export function useCalendarHeader({ startDate, endDate, type }: CalendarHeaderProps) {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const handleDateChange = (newDate: Date) => setCalendarDate(newDate);

  const typeSpecificHook = type === "monthly" ? useMonthlyCalendarHeader : useWeeklyCalendarHeader;
  const { canNext, canPrev, goToPrev, goToNext } = typeSpecificHook({ startDate, endDate, calendarDate, handleDateChange });
  const goToToday = () => handleDateChange(new Date());

  return { calendarDate, canNext, canPrev, goToPrev, goToNext, goToToday };
}


interface CalendarHeaderSubProps {
  startDate?: Date;
  endDate?: Date;
  calendarDate: Date;
  handleDateChange: (newDate: Date) => void;
}

interface CalendarHeaderSubReturn {
  canPrev: boolean;
  canNext: boolean;
  goToPrev: () => void;
  goToNext: () => void;
}

function useMonthlyCalendarHeader({ startDate, endDate, calendarDate, handleDateChange }: CalendarHeaderSubProps): CalendarHeaderSubReturn {
  const canPrev = !startDate || isAfter(startOfMonth(calendarDate), startOfMonth(startDate));
  const canNext = !endDate || isBefore(startOfMonth(calendarDate), startOfMonth(endDate));
  const goToNext = () => canNext && handleDateChange(addMonths(calendarDate, 1));
  const goToPrev = () => canPrev && handleDateChange(subMonths(calendarDate, 1));
  return { canPrev, canNext, goToPrev, goToNext };
}

function useWeeklyCalendarHeader({ startDate, endDate, calendarDate, handleDateChange }: CalendarHeaderSubProps): CalendarHeaderSubReturn {
  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(calendarDate, { weekStartsOn: 0 });

  const canPrev = !startDate || isAfter(weekStart, startOfWeek(startDate, { weekStartsOn: 0 }));
  const canNext = !endDate || isBefore(weekEnd, endOfWeek(endDate, { weekStartsOn: 0 }));

  const goToPrev = () => canPrev && handleDateChange(subWeeks(calendarDate, 1));
  const goToNext = () => canNext && handleDateChange(addWeeks(calendarDate, 1));
  return { canPrev, canNext, goToPrev, goToNext };
}