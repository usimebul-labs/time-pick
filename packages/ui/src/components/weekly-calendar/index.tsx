// packages/ui/src/components/weekly-calendar/index.tsx
'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { CalendarHeader } from './header';
import { DayHeader } from './day-header';
import { useWeeklyDrag } from './use-weekly-drag';
import { getSlotId, isDateDisabled } from './utils';
import { useWeeklyCalendar } from './use-weekly-calendar';

interface WeeklyCalendarProps {
  className?: string;
  currentDate?: Date;
  onCurrentDateChange?: (date: Date) => void;
  startHour?: number;
  endHour?: number;
  minDate?: Date;
  maxDate?: Date;
  value?: string[];
  onChange?: (slots: string[]) => void;
  readOnly?: boolean;
}

export function WeeklyCalendar({
  className,
  currentDate: date,
  onCurrentDateChange: onDateChange,
  startHour = 9,
  endHour = 18,
  minDate,
  maxDate,
  value: selectedSlots = [],
  onChange: onSlotsChange,
  readOnly = false,
}: WeeklyCalendarProps) {
  const {
    currentDate,
    weekDays,
    hours,
    canPrev,
    canNext,
    goToPrev,
    goToNext,
    goToToday,
  } = useWeeklyCalendar({ date, onDateChange, startHour, endHour, minDate, maxDate });

  const { containerRef, handlers } = useWeeklyDrag({ selectedSlots, onSlotsChange, readOnly });

  return (
    <div className={cn('flex flex-col h-full bg-background border rounded-lg overflow-hidden select-none', className)}>
      <CalendarHeader
        currentDate={currentDate}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={goToPrev}
        onNext={goToNext}
        onToday={goToToday}
      />

      <DayHeader weekDays={weekDays} minDate={minDate} maxDate={maxDate} />

      <div ref={containerRef} className="flex-1 overflow-y-auto touch-pan-y" onDragStart={(e) => e.preventDefault()}>
        <div className="grid grid-cols-8 divide-x divide-y" onTouchMove={handlers.onTouchMove}>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div
                className="col-span-1 py-3 pr-2 text-xs text-right text-muted-foreground font-medium border-b-0 h-16 sticky left-0 bg-background/95 z-10"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {`${hour}:00`}
              </div>

              {weekDays.map((day) => {
                const slotId = getSlotId(day, hour);
                const disabled = isDateDisabled(day, minDate, maxDate);
                const isSelected = selectedSlots.includes(slotId);

                return (
                  <div
                    key={slotId}
                    data-slot-id={slotId}
                    data-disabled={disabled}
                    onPointerDown={(e) => handlers.onPointerDown(e, slotId, disabled)}
                    onMouseEnter={(e) => handlers.onMouseEnter(e, slotId, disabled)}
                    className={cn(
                      'col-span-1 h-16 border-b relative transition-colors duration-75',
                      !disabled && !readOnly && 'active:bg-primary/20 hover:bg-primary/5 cursor-pointer',
                      disabled && 'bg-muted/20 cursor-not-allowed',
                      isSelected && 'bg-primary/80 border-primary/50',
                      isSelected && !disabled && 'hover:bg-primary/90',
                      !isSelected && !disabled && (day.getDay() === 0 || day.getDay() === 6) && 'bg-muted/5'
                    )}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}