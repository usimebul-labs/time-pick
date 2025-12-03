"use client";

import { useState, useCallback } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth,
  isSameDay, isToday, isBefore, isAfter, startOfDay, endOfDay
} from "date-fns";

export type CalendarViewProps = {
  selectedDates?: Date[];
  onSelectDates?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  currentDate?: Date;
  onCurrentDateChange?: (date: Date) => void;
};

export function useMonthlyCalendar({
  selectedDates = [],
  onSelectDates,
  minDate,
  maxDate,
  currentDate: date,
  onCurrentDateChange: onDateChange,
}: CalendarViewProps) {
  const [internalDate, setInternalDate] = useState(date || selectedDates[0] || new Date());
  const currentDate = date || internalDate;

  const handleDateChange = (newDate: Date) => {
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalDate(newDate);
    }
  };

  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isAfter(date, endOfDay(maxDate))) return true;
    return false;
  }, [minDate, maxDate]);

  const isSelected = useCallback((date: Date) => {
    return selectedDates.some(d => isSameDay(d, date));
  }, [selectedDates]);

  const canPrev = !minDate || isAfter(startOfMonth(currentDate), startOfMonth(minDate));
  const canNext = !maxDate || isBefore(startOfMonth(currentDate), startOfMonth(maxDate));

  const goToNext = () => canNext && handleDateChange(addMonths(currentDate, 1));
  const goToPrev = () => canPrev && handleDateChange(subMonths(currentDate, 1));
  const goToToday = () => handleDateChange(new Date());

  const monthStart = startOfMonth(currentDate);
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
    currentDate,
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