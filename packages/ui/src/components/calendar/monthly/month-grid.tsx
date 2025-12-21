import { isToday, isSameDay, parseISO } from 'date-fns';
import { useCalendarDrag } from '../hook/use-calendar-drag';
import { cn } from '../../../lib/utils';
import { CalendarParticipant } from '../index';
import { getHoliday } from '../../../lib/holidays';

interface MonthlyGridProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  days: Date[];
  isDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  participants?: CalendarParticipant[];
  selectedParticipantIds?: string[];
}

export function MonthGrid({ selectedDates, onSelectDates, days, isDisabled, isSelected, isCurrentMonth, participants = [], selectedParticipantIds = [] }: MonthlyGridProps) {
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

          // Holiday Check
          const holidayName = getHoliday(day);
          const isHoliday = !!holidayName;
          const isSunday = day.getDay() === 0;
          const isSaturday = day.getDay() === 6;

          // Calculate participants for this day
          const dayParticipants = participants.filter(p =>
            p.availabilities.some(a => isSameDay(parseISO(a), day))
          );
          const count = dayParticipants.length;
          const total = participants.length;
          const ratio = total > 0 ? count / total : 0;

          // Highlight logic
          let isHighlight = false;
          if (selectedParticipantIds.length > 0) {
            // If filtering: Highlight if ALL selected participants are available
            const selectedUsers = participants.filter(p => selectedParticipantIds.includes(p.id));
            if (selectedUsers.length > 0) {
              isHighlight = selectedUsers.every(p => p.availabilities.some(a => isSameDay(parseISO(a), day)));
            }
          }

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

                  // Text Color Logic (Holidays & Weekends)
                  // Only apply if NOT selected (selected has white text)
                  !selected && [
                    (isHoliday || isSunday) && 'text-red-500 font-medium',
                    !isHoliday && isSaturday && 'text-blue-500 font-medium',
                  ],

                  'hover:bg-accent hover:text-accent-foreground',
                  selected && 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
                  isToday(day) && !selected && 'bg-accent/50 text-accent-foreground font-semibold ring-1 ring-inset ring-accent-foreground/20',

                  // Highlight if all selected participants (or all if none selected) are available
                  isHighlight && 'ring-2 ring-inset ring-green-500/50',
                  !selected && isHighlight && 'bg-green-50/50',
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
    </div >
  );
}
