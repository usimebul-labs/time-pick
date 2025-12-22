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
  selectedParticipantIds?: string[];
}

interface WeekGridCellProps {
  day: Date;
  hour: number;
  isDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  participants: CalendarParticipant[];
  selectedParticipantIds: string[];
  onDragStart: (date: Date) => void;
  onDragOver: (date: Date) => void;
}

const WeekGridCell = React.memo(({ day, hour, isDisabled, isSelected, participants, selectedParticipantIds, onDragStart, onDragOver }: WeekGridCellProps) => {
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

  // Highlight logic
  let isHighlight = false;
  if (selectedParticipantIds.length > 0) {
    const selectedUsers = participants.filter(p => selectedParticipantIds.includes(p.id));
    if (selectedUsers.length > 0) {
      // Check if ISO slot string exists in availabilities
      isHighlight = selectedUsers.every(p => p.availabilities.includes(slotIso));
    }
  }

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
        'col-span-1 h-8 border-b relative transition-colors duration-75 flex items-end justify-center pb-1 touch-none',
        disabled && 'bg-gray-50 cursor-not-allowed text-muted-foreground line-through decoration-slate-400',
        !disabled && [
          'hover:bg-accent hover:text-accent-foreground',
          selected && 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground',
          // Highlight if all selected participants (or all if none selected) are available
          isHighlight && 'ring-2 ring-inset ring-green-500/50',
          !selected && isHighlight && 'bg-green-50/50',
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
}, (prev, next) => {
  // Custom comparison for performance
  const prevDate = new Date(prev.day); prevDate.setHours(prev.hour, 0, 0, 0);
  const nextDate = new Date(next.day); nextDate.setHours(next.hour, 0, 0, 0);

  // If static props changed, re-render
  if (prev.isDisabled !== next.isDisabled ||
    prev.participants !== next.participants ||
    prev.selectedParticipantIds !== next.selectedParticipantIds ||
    prev.onDragStart !== next.onDragStart ||
    prev.onDragOver !== next.onDragOver) {
    return false;
  }

  // Check selection change
  if (prev.isSelected(prevDate) !== next.isSelected(nextDate)) return false;

  // Check highlight change
  // Note: participants/selectedParticipantIds check above handles highlight dependency mostly, 
  // but if we want to be super granuluar we can check slot-specific highlight. 
  // For now, strict prop equality + isSelected check is good enough improvement.

  return true;
});


export function WeekGrid({ selectedDates, onSelectDates, hours, days, isDisabled, isSelected, participants = [], selectedParticipantIds = [] }: WeeklyGridProps) {
  const { onDragStart, onDragOver, onDragEnd, onTouchMove } = useCalendarDrag({ selectedDates, onSelectDates, isDisabled, isSelected });

  return (
    <div className="flex-1 overflow-y-auto touch-pan-y">
      <div className="grid grid-cols-8 divide-x divide-y" onMouseLeave={onDragEnd} onPointerUp={onDragEnd} onTouchMove={onTouchMove}>
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="col-span-1 py-2 pr-2 text-xs text-right text-muted-foreground font-medium border-b-0 h-8 sticky left-0 bg-background/95 z-10">
              {`${hour}:00`}
            </div>

            {days.map((day) => (
              <WeekGridCell
                key={`${day.toISOString()}-${hour}`}
                day={day}
                hour={hour}
                isDisabled={isDisabled}
                isSelected={isSelected}
                participants={participants}
                selectedParticipantIds={selectedParticipantIds}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div >
  );
}
