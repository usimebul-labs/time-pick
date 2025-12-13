"use client";

import { useCalendar } from '../hook/use-calendar';
import { MonthlyCalendarProps } from '../monthly';
import { DayHeader } from './day-header';
import { WeekGrid } from './week-grid';

import { CalendarParticipant } from '../index';

export interface WeeklyCalendarProps extends Omit<MonthlyCalendarProps, 'calendarDate'> {
  calendarDate: Date;
  startHour?: number;
  endHour?: number;
  participants?: CalendarParticipant[];
  selectedParticipantIds?: string[];
}

export function WeeklyCalendar({ calendarDate, selectedDates, onSelectDates, endDate, startDate, startHour, endHour, excludedDays, participants = [], selectedParticipantIds = [] }: WeeklyCalendarProps) {
  const { days, hours, isDisabled, isSelected } = useCalendar({ type: 'weekly', calendarDate, selectedDates, startHour, endHour, startDate, endDate, excludedDays });

  return (
    <>
      <DayHeader days={days} isDisabled={isDisabled} />
      <WeekGrid
        selectedDates={selectedDates}
        onSelectDates={onSelectDates}
        days={days}
        hours={hours}
        isDisabled={isDisabled}
        isSelected={isSelected}
        participants={participants}
        selectedParticipantIds={selectedParticipantIds}
      />
    </>
  );
}
