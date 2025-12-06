"use client";

import { useCalendar } from '../hook/use-calendar';
import { MonthGrid } from './month-grid';
import { WeekHeader } from './week-header';

export interface MonthlyCalendarProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  calendarDate: Date;
  enabledDays?: string[];
}

export function MonthlyCalendar({ calendarDate, selectedDates, onSelectDates, minDate, maxDate, enabledDays }: MonthlyCalendarProps) {
  const { days, isDisabled, isSelected, isCurrentMonth } = useCalendar({ type: 'monthly', calendarDate, selectedDates, minDate, maxDate, enabledDays });

  return (
    <div className="flex flex-col gap-2 select-none">
      <WeekHeader />
      <MonthGrid
        selectedDates={selectedDates}
        onSelectDates={onSelectDates}
        days={days}
        isDisabled={isDisabled}
        isSelected={isSelected}
        isCurrentMonth={isCurrentMonth}
      />
    </div>
  );
}
