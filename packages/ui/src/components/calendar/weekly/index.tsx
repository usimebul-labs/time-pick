"use client";

import { useCalendar } from '../hook/use-calendar';
import { MonthlyCalendarProps } from '../monthly';
import { DayHeader } from './day-header';
import { WeekGrid } from './week-grid';

export interface WeeklyCalendarProps extends MonthlyCalendarProps {
  startHour?: number;
  endHour?: number;
  heatmapData?: Record<string, { count: number; participants: any[] }>;
  totalParticipants?: number;
}

export function WeeklyCalendar({ calendarDate, selectedDates, onSelectDates, maxDate, minDate, startHour, endHour, enabledDays, heatmapData, totalParticipants }: WeeklyCalendarProps) {
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
        heatmapData={heatmapData}
        totalParticipants={totalParticipants}
      />
    </>
  );
}
