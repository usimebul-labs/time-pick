import { isToday } from 'date-fns';
import { useCalendarDrag } from '../hook/use-calendar-drag';
import { cn } from '../../../lib/utils';

interface MonthlyGridProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  days: Date[];
  isDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  heatmapData?: Record<string, { count: number; participants: any[] }>;
  totalParticipants?: number;
}

export function MonthGrid({ selectedDates, onSelectDates, days, isDisabled, isSelected, isCurrentMonth, heatmapData, totalParticipants }: MonthlyGridProps) {
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

          return (
            <button
              key={day.toISOString()}
              type="button"
              data-date={day.toISOString()}
              disabled={disabled}
              onPointerDown={() => onDragStart(day)}
              onMouseEnter={() => onDragOver(day)}
              className={cn(
                'h-10 w-full rounded-md flex items-center justify-center text-sm relative transition-all duration-200',
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
              {heatmapData && totalParticipants && heatmapData[day.toISOString()] && (
                <div
                  className="absolute inset-x-0 bottom-0 top-0 bg-primary/80 rounded-md z-0"
                  style={{
                    opacity: Math.min(Math.max(heatmapData[day.toISOString()].count / totalParticipants, 0), 1),
                  }}
                />
              )}
              <span className="z-10 relative">{day.toISOString().slice(8, 10)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
