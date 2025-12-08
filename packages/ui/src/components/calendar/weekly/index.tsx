"use client";

import { useCalendar } from '../hook/use-calendar';
import { MonthlyCalendarProps } from '../monthly';
import { DayHeader } from './day-header';
import { WeekGrid } from './week-grid';

import { CalendarParticipant } from '../index';

export interface WeeklyCalendarProps extends MonthlyCalendarProps {
  startHour?: number;
  endHour?: number;
  participants?: CalendarParticipant[];
}

export function WeeklyCalendar({ calendarDate, selectedDates, onSelectDates, maxDate, minDate, startHour, endHour, enabledDays, participants = [] }: WeeklyCalendarProps) {
  const { days, hours, isDisabled, isSelected } = useCalendar({ type: 'weekly', calendarDate, selectedDates, startHour, endHour, minDate, maxDate, enabledDays });

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
      />
    </>
  );
}
