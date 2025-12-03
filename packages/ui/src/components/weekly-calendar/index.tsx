// packages/ui/src/components/weekly-calendar/index.tsx
'use client';

import * as React from 'react';
import { addDays, addWeeks, subWeeks, startOfWeek, endOfWeek, isAfter, isBefore } from 'date-fns';
import { cn } from '../../lib/utils'; // 경로 주의

import { CalendarHeader } from './header';
import { DayHeader } from './day-header';
import { useWeeklyDrag } from './use-weekly-drag';
import { getSlotId, isDateDisabled } from './utils';

interface WeeklyCalendarProps {
  className?: string;
  date?: Date;
  onDateChange?: (date: Date) => void;
  startHour?: number;
  endHour?: number;
  minDate?: Date;
  maxDate?: Date;
  selectedSlots?: string[];
  onSlotsChange?: (slots: string[]) => void;
  readOnly?: boolean;
}

export function WeeklyCalendar({
  className,
  date,
  onDateChange,
  startHour = 9,
  endHour = 18,
  minDate,
  maxDate,
  selectedSlots = [],
  onSlotsChange,
  readOnly = false,
}: WeeklyCalendarProps) {
  const [internalDate, setInternalDate] = React.useState(new Date());
  const currentDate = date || internalDate;

  // 날짜 계산
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const canGoPrev = !minDate || isAfter(weekStart, startOfWeek(minDate, { weekStartsOn: 0 }));
  const canGoNext = !maxDate || isBefore(weekEnd, endOfWeek(maxDate, { weekStartsOn: 0 }));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // 커스텀 훅 호출
  const { containerRef, handlers } = useWeeklyDrag({ selectedSlots, onSlotsChange, readOnly });

  const handleDateChange = (newDate: Date) => (onDateChange ? onDateChange(newDate) : setInternalDate(newDate));

  return (
    <div className={cn('flex flex-col h-full bg-background border rounded-lg overflow-hidden select-none', className)}>
      <CalendarHeader
        currentDate={currentDate}
        canPrev={canGoPrev}
        canNext={canGoNext}
        onPrev={() => canGoPrev && handleDateChange(subWeeks(currentDate, 1))}
        onNext={() => canGoNext && handleDateChange(addWeeks(currentDate, 1))}
        onToday={() => handleDateChange(new Date())}
      />

      <DayHeader weekDays={weekDays} minDate={minDate} maxDate={maxDate} />

      <div ref={containerRef} className="flex-1 overflow-y-auto touch-pan-y" onDragStart={(e) => e.preventDefault()}>
        <div className="grid grid-cols-8 divide-x divide-y" onTouchMove={handlers.onTouchMove}>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* 왼쪽 시간 라벨 */}
              <div
                className="col-span-1 py-3 pr-2 text-xs text-right text-muted-foreground font-medium border-b-0 h-16 sticky left-0 bg-background/95 z-10"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {`${hour}:00`}
              </div>

              {/* 시간별 슬롯들 */}
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


