"use client";

import * as React from "react";
import { useMonthlyCalendar } from "./use-monthly-calendar";
import { useMonthlyDrag } from "./use-monthly-drag";
import { CalendarHeader } from "./header";
import { CalendarGrid } from "./grid";

export interface MonthlyCalendarProps {
  value?: Date[];
  onChange?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  currentDate?: Date;
  onCurrentDateChange?: (date: Date) => void;
}

export function MonthlyCalendar({ 
  value: selectedDates,
  onChange: onSelectDates,
  minDate,
  maxDate,
  currentDate,
  onCurrentDateChange,
}: MonthlyCalendarProps) {
  const { 
    currentDate: calendarDate,
    calendarDays,
    goToNext,
    goToPrev,
    goToToday,
    getDayProps,
    canPrev,
    canNext,
    isDateDisabled,
    isSelected,
  } = useMonthlyCalendar({
    selectedDates,
    onSelectDates,
    minDate,
    maxDate,
    currentDate,
    onCurrentDateChange
  });

  const dragHandlers = useMonthlyDrag({
    selectedDates: selectedDates || [],
    onSelectDates,
    isDateDisabled,
    isSelected,
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-card border rounded-xl shadow-sm select-none">
      <CalendarHeader 
        currentDate={calendarDate}
        onPrev={goToPrev}
        onNext={goToNext}
        onToday={goToToday}
        canPrev={canPrev}
        canNext={canNext}
      />
      
      <CalendarGrid 
        calendarDays={calendarDays}
        getDayProps={getDayProps}
        dragHandlers={dragHandlers}
      />
    </div>
  );
}