"use client";

export * from './share-calendar-dialog';


import { cn } from '../../lib/utils';
import { MonthlyCalendar } from './monthly';
import { CalendarHeader } from './header';
import { useCalendarHeader } from './hook/use-calendar-header';
import { WeeklyCalendar } from './weekly';

export interface CalendarParticipant {
  id: string;
  name: string;
  avatarUrl: string | null;
  availabilities: string[];
}

export interface CalendarProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  startDate?: Date;
  endDate?: Date;
  startHour?: number;
  endHour?: number;
  type: 'monthly' | 'weekly';
  excludedDays?: number[];
  participants?: CalendarParticipant[];
}

export function Calendar({ type, selectedDates, onSelectDates, startDate, endDate, startHour, endHour, excludedDays, participants = [] }: CalendarProps) {

  const { calendarDate, canNext, canPrev, goToNext, goToPrev, goToToday } = useCalendarHeader({ type, startDate, endDate });

  return (
    <div className={cn('flex flex-col h-full bg-background border rounded-lg overflow-hidden select-none')}>
      <CalendarHeader calendarDate={calendarDate} canNext={canNext} canPrev={canPrev} goToNext={goToNext} goToPrev={goToPrev} goToToday={goToToday} />
      {type === 'weekly' ? (
        <WeeklyCalendar
          calendarDate={calendarDate}
          selectedDates={selectedDates}
          onSelectDates={onSelectDates}
          startDate={startDate}
          endDate={endDate}
          startHour={startHour}
          endHour={endHour}
          excludedDays={excludedDays}
          participants={participants}
        />
      ) : (
        <MonthlyCalendar
          calendarDate={calendarDate}
          selectedDates={selectedDates}
          onSelectDates={onSelectDates}
          startDate={startDate}
          endDate={endDate}
          excludedDays={excludedDays}
          participants={participants}
        />
      )}
    </div>
  );
}
