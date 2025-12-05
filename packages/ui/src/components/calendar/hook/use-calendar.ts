import { addDays, eachDayOfInterval, endOfDay, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameMinute, isSameMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { useCallback } from "react";



interface UseCalendarProps {
  type: 'monthly' | 'weekly';
  calendarDate: Date;
  selectedDates: Date[];
  startHour?: number;
  endHour?: number;
  minDate?: Date;
  maxDate?: Date;
  enabledDays?: string[];
}

export function useCalendar({ type, calendarDate, selectedDates, startHour = 9, endHour = 18, minDate, maxDate, enabledDays }: UseCalendarProps) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const days = type === 'monthly' ? getMonthDays(calendarDate) : getWeekDays(calendarDate);

  const isDisabled = useCallback((date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isAfter(date, endOfDay(maxDate))) return true;

    if (enabledDays && enabledDays.length > 0) {
      const dayName = format(date, 'E'); // 'Mon', 'Tue', etc.
      if (!enabledDays.includes(dayName)) return true;
    }

    return false;
  }, [minDate, maxDate, enabledDays]);

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
