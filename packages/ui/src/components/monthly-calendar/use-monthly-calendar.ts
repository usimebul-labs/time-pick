"use client";

import { useState, useCallback } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth,
  isSameDay, isToday, isBefore, isAfter, startOfDay, endOfDay
} from "date-fns";

export type CalendarViewProps = {
  selectedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
};

export function useMonthlyCalendar({ selectedDates = [], minDate, maxDate }: CalendarViewProps) {
  const [calendarDate, setCalendarDate] = useState(selectedDates[0] || new Date());

  const handleDateChange = (newDate: Date) => {
    setCalendarDate(newDate);
  };

  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isAfter(date, endOfDay(maxDate))) return true;

    return false;
  }, [minDate, maxDate]);

  const isSelected = useCallback((date: Date) => {
    return selectedDates.some(selectedDate => isSameDay(selectedDate, date));
  }, [selectedDates]);

  const canPrev = !minDate || isAfter(startOfMonth(calendarDate), startOfMonth(minDate));
  const canNext = !maxDate || isBefore(startOfMonth(calendarDate), startOfMonth(maxDate));

  const goToNext = () => canNext && handleDateChange(addMonths(calendarDate, 1));
  const goToPrev = () => canPrev && handleDateChange(subMonths(calendarDate, 1));
  const goToToday = () => handleDateChange(new Date());

  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(monthStart);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  const getDayProps = (day: Date) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, monthStart),
    isToday: isToday(day),
    isDisabled: isDateDisabled(day),
    isSelected: isSelected(day),
  });

  return {
    calendarDate,
    calendarDays,
    goToNext,
    goToPrev,
    goToToday,
    getDayProps,
    canPrev,
    canNext,
    isDateDisabled,
    isSelected,
  };
}