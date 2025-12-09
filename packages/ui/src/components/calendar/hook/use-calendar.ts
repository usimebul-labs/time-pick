import { addDays, eachDayOfInterval, endOfDay, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameMinute, isSameMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { useCallback } from "react";



interface UseCalendarProps {
  type: 'monthly' | 'weekly';
  calendarDate: Date;
  selectedDates: Date[];
  startHour?: number;
  endHour?: number;
  startDate?: Date;
  endDate?: Date;
  excludedDays?: number[];
}

export function useCalendar({ type, calendarDate, selectedDates, startHour = 9, endHour = 18, startDate, endDate, excludedDays }: UseCalendarProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const days = type === 'monthly' ? getMonthDays(calendarDate) : getWeekDays(calendarDate);

  const isDisabled = useCallback((date: Date) => {
    if (startDate && isBefore(date, startOfDay(startDate))) return true;
    if (endDate && isAfter(date, endOfDay(endDate))) return true;

    if (excludedDays && excludedDays.length > 0) {
      const dayIndex = date.getDay(); // 0 = Sunday, 6 = Saturday
      if (excludedDays.includes(dayIndex)) return true;
    }

    return false;
  }, [startDate, endDate, excludedDays]);

  const isSelected = useCallback((date: Date) => {
    return selectedDates.some(d => isSameMinute(d, date));
  }, [selectedDates]);

  const isCurrentMonth = useCallback((date: Date) => {
    return isSameMonth(date, calendarDate);
  }, [calendarDate]);


  return { days, hours, isDisabled, isSelected, isCurrentMonth };
}


function getWeekDays(calendarDate: Date) {
  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

function getMonthDays(calendarDate: Date) {
  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(monthStart);
  return eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });
}
