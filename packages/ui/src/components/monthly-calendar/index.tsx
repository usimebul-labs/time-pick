'use client';

import * as React from 'react';
import { useMonthlyCalendar } from './use-monthly-calendar';
import { useMonthlyDrag } from './use-monthly-drag';
import { CalendarHeader } from './header';
import { CalendarGrid } from './grid';

export interface MonthlyCalendarProps {
  selectedDates: Date[];
  onSelectDates?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function MonthlyCalendar({ selectedDates, onSelectDates, minDate, maxDate }: MonthlyCalendarProps) {
  const { calendarDate, calendarDays, goToNext, goToPrev, goToToday, getDayProps, canPrev, canNext, isDateDisabled, isSelected } = useMonthlyCalendar({
    selectedDates,
    minDate,
    maxDate,
  });

  const dragHandlers = useMonthlyDrag({ selectedDates, onSelectDates, isDateDisabled, isSelected });

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-card border rounded-xl shadow-sm select-none">
      <CalendarHeader currentDate={calendarDate} onPrev={goToPrev} onNext={goToNext} onToday={goToToday} canPrev={canPrev} canNext={canNext} />
      <CalendarGrid calendarDays={calendarDays} getDayProps={getDayProps} dragHandlers={dragHandlers} />
    </div>
  );
}
