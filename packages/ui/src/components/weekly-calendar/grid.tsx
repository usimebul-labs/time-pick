import React from 'react';
import { cn } from '../../lib/utils'; // 요청하신 경로
import type { useWeeklyCalendar } from './use-weekly-calendar';
import { useWeeklyDrag } from './use-weekly-drag';
import { isDateDisabled } from './utils';
import { isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';

type CalendarLogic = ReturnType<typeof useWeeklyCalendar>;
type DragHandler = ReturnType<typeof useWeeklyDrag>;

interface CalendarGridProps {
  weekDays: Date[];
  calendarDays: Date[];
  hours: number[];
  minDate?: Date;
  maxDate?: Date;
  getDayProps: CalendarLogic['getDayProps'];
  dragHandlers: DragHandler;
}

export function CalendarGrid({ weekDays, calendarDays, hours, minDate, maxDate, getDayProps, dragHandlers }: CalendarGridProps) {
  const { onDragStart, onDragOver, onDragEnd } = dragHandlers;

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch!.clientX, touch!.clientY);

    // 버튼 내부의 span이나 다른 요소를 찍어도 부모 button을 찾도록 closest 사용
    const dateAttr = target?.getAttribute('data-date') || target?.closest('button')?.getAttribute('data-date');
    if (dateAttr) onDragOver(new Date(dateAttr));
  };

  return (
    <>
      <div className="grid grid-cols-8 border-b divide-x bg-muted/30 shrink-0">
        <div className="col-span-1 py-2 text-center text-xs text-muted-foreground font-medium">시간</div>
        {weekDays.map((day) => {
          const disabled = isDateDisabled(day, minDate, maxDate);
          return (
            <div key={day.toString()} className={cn('col-span-1 py-2 text-center flex flex-col items-center justify-center gap-1', disabled && 'opacity-50')}>
              <span className={cn('text-xs font-medium', isToday(day) ? 'text-primary' : 'text-muted-foreground')}>{format(day, 'E', { locale: ko })}</span>
              <span
                className={cn(
                  'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
                  isToday(day) ? 'bg-primary text-primary-foreground' : 'text-foreground',
                )}
              >
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto touch-pan-y">
        <div className="grid grid-cols-8 divide-x divide-y" onMouseLeave={onDragEnd} onPointerUp={onDragEnd} onTouchMove={handleTouchMove}>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="col-span-1 py-3 pr-2 text-xs text-right text-muted-foreground font-medium border-b-0 h-16 sticky left-0 bg-background/95 z-10">
                {`${hour}:00`}
              </div>

              {calendarDays.map((day) => {
                const { datetime, isDisabled, isSelected } = getDayProps(day, hour);
                return (
                  <div
                    key={datetime.toISOString()}
                    data-date={datetime.toISOString()}
                    data-disabled={isDisabled}
                    onPointerDown={() => onDragStart(datetime)}
                    onMouseEnter={() => onDragOver(datetime)}
                    className={cn(
                      'col-span-1 h-16 border-b relative transition-colors duration-75',
                      isDisabled && 'bg-gray-50 cursor-not-allowed text-muted-foreground line-through decoration-slate-400',
                      !isDisabled && [
                        'hover:bg-accent hover:text-accent-foreground',
                        isSelected && 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
                      ],
                    )}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
