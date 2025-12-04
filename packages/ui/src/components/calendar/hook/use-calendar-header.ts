import { addMonths, addWeeks, endOfWeek, isAfter, isBefore, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";
import { useState } from "react";



export interface CalendarHeaderProps {
  minDate?: Date;
  maxDate?: Date;
  type: 'monthly' | 'weekly';
}

export function useCalendarHeader({ minDate, maxDate, type }: CalendarHeaderProps) {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const handleDateChange = (newDate: Date) => setCalendarDate(newDate);

  const typeSpecificHook = type === "monthly" ? useMonthlyCalendarHeader : useWeeklyCalendarHeader;
  const { canNext, canPrev, goToPrev, goToNext } = typeSpecificHook({ minDate, maxDate, calendarDate, handleDateChange });
  const goToToday = () => handleDateChange(new Date());

  return { calendarDate, canNext, canPrev, goToPrev, goToNext, goToToday };
}


interface CalendarHeaderSubProps {
  minDate?: Date;
  maxDate?: Date;
  calendarDate: Date;
  handleDateChange: (newDate: Date) => void;
}

interface CalendarHeaderSubReturn {
  canPrev: boolean;
  canNext: boolean;
  goToPrev: () => void;
  goToNext: () => void;
}

function useMonthlyCalendarHeader({ minDate, maxDate, calendarDate, handleDateChange }: CalendarHeaderSubProps): CalendarHeaderSubReturn {
  const canPrev = !minDate || isAfter(startOfMonth(calendarDate), startOfMonth(minDate));
  const canNext = !maxDate || isBefore(startOfMonth(calendarDate), startOfMonth(maxDate));
  const goToNext = () => canNext && handleDateChange(addMonths(calendarDate, 1));
  const goToPrev = () => canPrev && handleDateChange(subMonths(calendarDate, 1));
  return { canPrev, canNext, goToPrev, goToNext };
}

function useWeeklyCalendarHeader({ minDate, maxDate, calendarDate, handleDateChange }: CalendarHeaderSubProps): CalendarHeaderSubReturn {
  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(calendarDate, { weekStartsOn: 0 });

  const canPrev = !minDate || isAfter(weekStart, startOfWeek(minDate, { weekStartsOn: 0 }));
  const canNext = !maxDate || isBefore(weekEnd, endOfWeek(maxDate, { weekStartsOn: 0 }));

  const goToPrev = () => canPrev && handleDateChange(subWeeks(calendarDate, 1));
  const goToNext = () => canNext && handleDateChange(addWeeks(calendarDate, 1));
  return { canPrev, canNext, goToPrev, goToNext };
}