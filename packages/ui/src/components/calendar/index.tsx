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
  minDate?: Date;
  maxDate?: Date;
  startHour?: number;
  endHour?: number;
  type: 'monthly' | 'weekly';
  enabledDays?: string[];
  participants?: CalendarParticipant[];
}

export function Calendar({ type, selectedDates, onSelectDates, minDate, maxDate, startHour, endHour, enabledDays, participants = [] }: CalendarProps) {
  const { calendarDate, canNext, canPrev, goToNext, goToPrev, goToToday } = useCalendarHeader({ type, minDate, maxDate });

  return (
    <div className={cn('flex flex-col h-full bg-background border rounded-lg overflow-hidden select-none')}>
      <CalendarHeader calendarDate={calendarDate} canNext={canNext} canPrev={canPrev} goToNext={goToNext} goToPrev={goToPrev} goToToday={goToToday} />
      {type === 'weekly' ? (
        <WeeklyCalendar
          calendarDate={calendarDate}
          selectedDates={selectedDates}
          onSelectDates={onSelectDates}
          minDate={minDate}
          maxDate={maxDate}
          startHour={startHour}
          endHour={endHour}
          enabledDays={enabledDays}
          participants={participants}
        />
      ) : (
        <MonthlyCalendar
          calendarDate={calendarDate}
          selectedDates={selectedDates}
          onSelectDates={onSelectDates}
          minDate={minDate}
          maxDate={maxDate}
          enabledDays={enabledDays}
          participants={participants}
        />
      )}
    </div>
  );
}
