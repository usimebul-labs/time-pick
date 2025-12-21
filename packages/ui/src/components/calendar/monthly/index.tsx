"use client";

import { useCalendar } from '../hook/use-calendar';
import { MonthGrid } from './month-grid';
import { WeekHeader } from './week-header';

import { CalendarParticipant } from '../index';

export interface MonthlyCalendarProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  startDate?: Date;
  endDate?: Date;
  calendarDate: Date;
  excludedDays?: number[];
  participants?: CalendarParticipant[];
  selectedParticipantIds?: string[];
  disableHolidays?: boolean;
  disabledDates?: Date[];
}

export function MonthlyCalendar({ calendarDate, selectedDates, onSelectDates, startDate, endDate, excludedDays, participants = [], selectedParticipantIds = [], disableHolidays, disabledDates = [] }: MonthlyCalendarProps) {
  const { days, isDisabled, isSelected, isCurrentMonth } = useCalendar({ type: 'monthly', calendarDate, selectedDates, startDate, endDate, excludedDays, disableHolidays, disabledDates });

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
        participants={participants}
        selectedParticipantIds={selectedParticipantIds}
      />
    </div>
  );
}
