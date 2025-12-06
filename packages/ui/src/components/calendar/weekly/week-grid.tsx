import React, { use } from 'react';
import { useCalendarDrag } from '../hook/use-calendar-drag';
import { cn } from '../../../lib/utils';

interface WeeklyGridProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  hours: number[];
  days: Date[];
  isDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  heatmapData?: Record<string, { count: number; participants: any[] }>;
  totalParticipants?: number;
}

export function WeekGrid({ selectedDates, onSelectDates, hours, days, isDisabled, isSelected, heatmapData, totalParticipants }: WeeklyGridProps) {
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
                    'col-span-1 h-16 border-b relative transition-colors duration-75',
                    disabled && 'bg-gray-50 cursor-not-allowed text-muted-foreground line-through decoration-slate-400',
                    !disabled && [
                      'hover:bg-accent hover:text-accent-foreground',
                      selected && 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
                    ],
                  )}
                >
                  {heatmapData && totalParticipants && heatmapData[datetime.toISOString()] && (
                    <div
                      className="absolute inset-x-0 bottom-0 top-0 bg-primary/80 z-0"
                      style={{
                        opacity: Math.min(Math.max(heatmapData[datetime.toISOString()].count / totalParticipants, 0), 1),
                      }}
                    />
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
