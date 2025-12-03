// packages/ui/src/components/weekly-calendar/day-header.tsx
import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '../../lib/utils'; // 경로 주의 (../../)
import { isDateDisabled } from './utils';

interface DayHeaderProps {
  weekDays: Date[];
  minDate?: Date;
  maxDate?: Date;
}

export function DayHeader({ weekDays, minDate, maxDate }: DayHeaderProps) {
  return (
    <div className="grid grid-cols-8 border-b divide-x bg-muted/30 flex-shrink-0">
      <div className="col-span-1 py-2 text-center text-xs text-muted-foreground font-medium">시간</div>
      {weekDays.map((day) => {
        const disabled = isDateDisabled(day, minDate, maxDate);
        return (
          <div key={day.toString()} className={cn('col-span-1 py-2 text-center flex flex-col items-center justify-center gap-1', disabled && 'opacity-50')}>
            <span className={cn('text-xs font-medium', isToday(day) ? 'text-primary' : 'text-muted-foreground')}>{format(day, 'E', { locale: ko })}</span>
            <span
              className={cn(
                'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
                isToday(day) ? 'bg-primary text-primary-foreground' : 'text-foreground'
              )}
            >
              {format(day, 'd')}
            </span>
          </div>
        );
      })}
    </div>
  );
}
