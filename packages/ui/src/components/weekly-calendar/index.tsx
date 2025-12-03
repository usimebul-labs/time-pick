// packages/ui/src/components/weekly-calendar/index.tsx
'use client';

import { cn } from '../../lib/utils';
import { CalendarGrid } from './grid';
import { CalendarHeader } from './header';
import { useWeeklyCalendar } from './use-weekly-calendar';
import { useWeeklyDrag } from './use-weekly-drag';

interface WeeklyCalendarProps {
  startHour?: number;
  endHour?: number;
  minDate?: Date;
  maxDate?: Date;
  selectedDates: Date[];
  onSelectDates?: (dates: Date[]) => void;
}

export function WeeklyCalendar({ startHour = 9, endHour = 18, minDate, maxDate, selectedDates, onSelectDates }: WeeklyCalendarProps) {
  const { calendarDate, calendarDays, hours, canPrev, canNext, goToPrev, goToNext, goToToday, isDateDisabled, isSelected, getDayProps } = useWeeklyCalendar({
    selectedDates,
    startHour,
    endHour,
    minDate,
    maxDate,
  });

  const dragHandlers = useWeeklyDrag({ selectedDates, onSelectDates, isDateDisabled, isSelected });

  return (
    <div className={cn('flex flex-col h-full bg-background border rounded-lg overflow-hidden select-none')}>
      <CalendarHeader currentDate={calendarDate} onPrev={goToPrev} onNext={goToNext} onToday={goToToday} canPrev={canPrev} canNext={canNext} />
      <CalendarGrid
        weekDays={calendarDays}
        minDate={minDate}
        maxDate={maxDate}
        calendarDays={calendarDays}
        hours={hours}
        getDayProps={getDayProps}
        dragHandlers={dragHandlers}
      />
    </div>
  );
}
