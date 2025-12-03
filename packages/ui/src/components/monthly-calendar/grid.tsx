'use client';

import { useRef } from 'react';
import { cn } from '../../lib/utils'; // 요청하신 경로
import type { useMonthlyCalendar } from './use-monthly-calendar';
import { useMonthlyDrag } from './use-monthly-drag';

type CalendarLogic = ReturnType<typeof useMonthlyCalendar>;
type DragHandler = ReturnType<typeof useMonthlyDrag>;

interface CalendarGridProps {
  calendarDays: Date[];
  getDayProps: CalendarLogic['getDayProps'];
  dragHandlers: DragHandler;
}

export function CalendarGrid({ calendarDays, getDayProps, dragHandlers }: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const { onDragStart, onDragOver, onDragEnd } = dragHandlers;

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch!.clientX, touch!.clientY);

    // 버튼 내부의 span이나 다른 요소를 찍어도 부모 button을 찾도록 closest 사용
    const dateAttr = target?.getAttribute('data-date') || target?.closest('button')?.getAttribute('data-date');
    if (dateAttr) onDragOver(new Date(dateAttr));
  };

  return (
    <div className="flex flex-col gap-2 select-none">
      <div className="grid grid-cols-7 text-center">
        {weekDays.map((day) => (
          <div key={day} className="text-muted-foreground text-xs font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-1 auto-rows-fr touch-none"
        onMouseLeave={onDragEnd}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        onTouchMove={handleTouchMove}
      >
        {calendarDays.map((day) => {
          const { date, isCurrentMonth, isSelected, isToday, isDisabled } = getDayProps(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              data-date={day.toISOString()}
              disabled={isDisabled}
              onPointerDown={() => onDragStart(day)}
              onMouseEnter={() => onDragOver(day)}
              className={cn(
                'h-10 w-full rounded-md flex items-center justify-center text-sm relative transition-all duration-200',
                isDisabled && 'opacity-20 cursor-not-allowed text-muted-foreground line-through decoration-slate-400',
                !isDisabled && [
                  !isCurrentMonth && 'text-muted-foreground/30',
                  isCurrentMonth && 'text-foreground',
                  'hover:bg-accent hover:text-accent-foreground',
                  isSelected && 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
                  isToday && !isSelected && 'bg-accent/50 text-accent-foreground font-semibold ring-1 ring-inset ring-accent-foreground/20',
                ],
              )}
            >
              {date}
            </button>
          );
        })}
      </div>
    </div>
  );
}
