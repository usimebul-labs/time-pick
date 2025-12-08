import React, { use } from 'react';
import { useCalendarDrag } from '../hook/use-calendar-drag';
import { cn } from '../../../lib/utils';
import { CalendarParticipant } from '../index';
import { parseISO } from 'date-fns';

interface WeeklyGridProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  hours: number[];
  days: Date[];
  isDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  participants?: CalendarParticipant[];
}

export function WeekGrid({ selectedDates, onSelectDates, hours, days, isDisabled, isSelected, participants = [] }: WeeklyGridProps) {
  const { onDragStart, onDragOver, onDragEnd, onTouchMove } = useCalendarDrag({ selectedDates, onSelectDates, isDisabled, isSelected });

  return (
    <div className="flex-1 overflow-y-auto touch-pan-y">
      <div className="grid grid-cols-8 divide-x divide-y" onMouseLeave={onDragEnd} onPointerUp={onDragEnd} onTouchMove={onTouchMove}>
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="col-span-1 py-3 pr-2 text-xs text-right text-muted-foreground font-medium border-b-0 h-16 sticky left-0 bg-background/95 z-10">
              {`${hour}:00`}
            </div>

            {days.map((day) => {
              const datetime = new Date(day);
              datetime.setHours(hour, 0, 0, 0);
              const disabled = isDisabled(day);
              const selected = isSelected(datetime);

              // Calculate participants for this slot
              const slotIso = datetime.toISOString();
              const slotParticipants = participants.filter(p =>
                p.availabilities.includes(slotIso)
              );
              const count = slotParticipants.length;
              const total = participants.length;
              const ratio = total > 0 ? count / total : 0;

              return (
                <div
                  key={datetime.toISOString()}
                  data-date={datetime.toISOString()}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onDragStart(datetime);
                  }}
                  onMouseEnter={() => onDragOver(datetime)}
                  className={cn(
                    'col-span-1 h-16 border-b relative transition-colors duration-75 flex items-end justify-center pb-1',
                    disabled && 'bg-gray-50 cursor-not-allowed text-muted-foreground line-through decoration-slate-400',
                    !disabled && [
                      'hover:bg-accent hover:text-accent-foreground',
                      selected && 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
                    ],
                  )}
                >
                  {/* Participant Count Text */}
                  {!disabled && total > 0 && count > 0 && (
                    <span
                      className={cn(
                        "text-[10px] font-medium z-10 select-none pointer-events-none",
                        selected ? "text-primary-foreground/80" : "text-primary"
                      )}
                      style={{ opacity: Math.max(ratio, 0.3) }}
                    >
                      {count}/{total}
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div >
  );
}
