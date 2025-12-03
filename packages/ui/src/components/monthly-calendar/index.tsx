"use client";

import * as React from "react";
import { useMonthlyCalendar, CalendarViewProps } from "./use-monthly-calendar";
import { CalendarHeader } from "./calendar-header";
import { CalendarGrid } from "./calendar-grid";

export function MonthlyCalendar({ 
  selectedDates, 
  onSelectDates,
  minDate,
  maxDate 
}: CalendarViewProps) {
  const { 
    currentMonth, 
    calendarDays, 
    nextMonth, 
    prevMonth, 
    getDayProps, 
    canGoPrev, 
    canGoNext,
    dragHandlers
  } = useMonthlyCalendar({ selectedDates, onSelectDates, minDate, maxDate });

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-card border rounded-xl shadow-sm select-none">
      <CalendarHeader 
        currentMonth={currentMonth} 
        onPrevMonth={prevMonth} 
        onNextMonth={nextMonth} 
        canGoPrev={canGoPrev} 
        canGoNext={canGoNext} 
      />
      
      <CalendarGrid 
        calendarDays={calendarDays}
        getDayProps={getDayProps}
        dragHandlers={dragHandlers}
      />
    </div>
  );
}