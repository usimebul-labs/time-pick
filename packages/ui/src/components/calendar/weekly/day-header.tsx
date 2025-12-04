import { cn } from '../../../lib/utils';
import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DayHeaderProps {
  days: Date[];
  isDisabled: (day: Date) => boolean;
}

export function DayHeader({ days, isDisabled }: DayHeaderProps) {
  return (
    <div className="grid grid-cols-8 border-b divide-x bg-muted/30 shrink-0">
      <div className="col-span-1 py-2 text-center text-xs text-muted-foreground font-medium">시간</div>
      {days.map((day) => {
        const disabled = isDisabled(day);
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
  );
}
