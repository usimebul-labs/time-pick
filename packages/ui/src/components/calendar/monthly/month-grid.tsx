import { isToday, isSameDay, parseISO } from 'date-fns';
import { useCalendarDrag } from '../hook/use-calendar-drag';
import { cn } from '../../../lib/utils';
import { CalendarParticipant } from '../index';

interface MonthlyGridProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  days: Date[];
  isDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  participants?: CalendarParticipant[];
}

export function MonthGrid({ selectedDates, onSelectDates, days, isDisabled, isSelected, isCurrentMonth, participants = [] }: MonthlyGridProps) {
  const { onDragStart, onDragOver, onDragEnd, onTouchMove } = useCalendarDrag({ selectedDates, onSelectDates, isDisabled, isSelected });

  return (
    <div className="flex flex-col gap-2 select-none">
      <div
        className="grid grid-cols-7 gap-1 auto-rows-fr touch-none"
        onMouseLeave={onDragEnd}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        onTouchMove={onTouchMove}
      >
        {days.map((day) => {
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const currentMonth = isCurrentMonth(day);

          // Calculate participants for this day
          const dayParticipants = participants.filter(p =>
            p.availabilities.some(a => isSameDay(parseISO(a), day))
          );
          const count = dayParticipants.length;
          const total = participants.length;
          const ratio = total > 0 ? count / total : 0;

          return (
            <button
              key={day.toISOString()}
              type="button"
              data-date={day.toISOString()}
              disabled={disabled}
              onPointerDown={() => onDragStart(day)}
              onMouseEnter={() => onDragOver(day)}
              className={cn(
                'h-10 w-full rounded-md flex flex-col items-center justify-center text-sm relative transition-all duration-200',
                disabled && 'opacity-20 cursor-not-allowed text-muted-foreground line-through decoration-slate-400',
                !disabled && [
                  !currentMonth && 'text-muted-foreground/30',
                  currentMonth && 'text-foreground',
                  'hover:bg-accent hover:text-accent-foreground',
                  selected && 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
                  isToday(day) && !selected && 'bg-accent/50 text-accent-foreground font-semibold ring-1 ring-inset ring-accent-foreground/20',
                ],
              )}
            >
              <span className={cn("z-10 relative leading-none", count > 0 && "mb-1")}>{day.getDate()}</span>

              {/* Participant Count Text - Bottom Center */}
              {!disabled && total > 0 && count > 0 && (
                <span
                  className={cn(
                    "absolute bottom-0.5 w-full text-center text-[9px] font-medium z-10",
                    selected ? "text-primary-foreground/80" : "text-primary"
                  )}
                  style={{ opacity: Math.max(ratio, 0.3) }}
                >
                  {count}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
