"use client";

import { useCallback, useState } from "react";
import {
  addDays,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMinute,
} from "date-fns";

export type WeeklyCalendarProps = {
  selectedDates: Date[];
  startHour?: number;
  endHour?: number;
  minDate?: Date;
  maxDate?: Date;
};

export function useWeeklyCalendar({ selectedDates, startHour = 9, endHour = 18, minDate, maxDate }: WeeklyCalendarProps) {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const handleDateChange = (newDate: Date) => setCalendarDate(newDate);

  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isAfter(date, endOfDay(maxDate))) return true;

    return false;
  }, [minDate, maxDate]);

  const isSelected = useCallback((date: Date) => {
    return selectedDates.some(d => isSameMinute(d, date));
  }, [selectedDates]);

  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(calendarDate, { weekStartsOn: 0 });
  const canPrev = !minDate || isAfter(weekStart, startOfWeek(minDate, { weekStartsOn: 0 }));
  const canNext = !maxDate || isBefore(weekEnd, endOfWeek(maxDate, { weekStartsOn: 0 }));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const calendarDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPrev = () => canPrev && handleDateChange(subWeeks(calendarDate, 1));
  const goToNext = () => canNext && handleDateChange(addWeeks(calendarDate, 1));
  const goToToday = () => handleDateChange(new Date());

  const getDayProps = (day: Date, hour: number) => {
    const datetime = new Date(day)
    datetime.setHours(hour, 0, 0, 0);

    return ({
      datetime,
      isDisabled: isDateDisabled(datetime),
      isSelected: isSelected(datetime),
    })
  };

  return {
    calendarDate,
    calendarDays,
    hours,
    goToPrev,
    goToNext,
    goToToday,
    canPrev,
    canNext,
    isDateDisabled,
    isSelected,
    getDayProps
  };
}