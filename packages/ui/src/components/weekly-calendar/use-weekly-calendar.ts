"use client";

import { useState } from "react";
import {
  addDays,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isAfter,
  isBefore,
} from "date-fns";

export type WeeklyCalendarProps = {
  date?: Date;
  onDateChange?: (date: Date) => void;
  startHour?: number;
  endHour?: number;
  minDate?: Date;
  maxDate?: Date;
};

export function useWeeklyCalendar({ date, onDateChange, startHour = 9, endHour = 18, minDate, maxDate }: WeeklyCalendarProps) {
  const [internalDate, setInternalDate] = useState(new Date());
  const currentDate = date || internalDate;

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const canPrev = !minDate || isAfter(weekStart, startOfWeek(minDate, { weekStartsOn: 0 }));
  const canNext = !maxDate || isBefore(weekEnd, endOfWeek(maxDate, { weekStartsOn: 0 }));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleDateChange = (newDate: Date) =>
    onDateChange ? onDateChange(newDate) : setInternalDate(newDate);

  const goToPrev = () =>
    canPrev && handleDateChange(subWeeks(currentDate, 1));
  const goToNext = () =>
    canNext && handleDateChange(addWeeks(currentDate, 1));
  const goToToday = () => handleDateChange(new Date());

  return {
    currentDate,
    weekDays,
    hours,
    canPrev,
    canNext,
    goToPrev,
    goToNext,
    goToToday,
  };
}