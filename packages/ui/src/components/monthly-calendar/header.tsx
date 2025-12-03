'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '../../lib/utils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function CalendarHeader({ currentDate, onPrev, onNext, onToday, canPrev, canNext }: CalendarHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4')}>
      <h2 className="font-semibold text-lg ml-1">{format(currentDate, 'yyyy년 M월', { locale: ko })}</h2>
      <div className="flex gap-1">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={cn(
            'p-2 rounded-md transition-colors',
            canPrev
              ? 'hover:bg-accent text-muted-foreground hover:text-foreground'
              : 'opacity-30 cursor-not-allowed text-muted-foreground',
          )}
          type="button"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={onToday} className="px-2 py-1 text-xs font-medium border rounded hover:bg-muted">
          오늘
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className={cn(
            'p-2 rounded-md transition-colors',
            canNext
              ? 'hover:bg-accent text-muted-foreground hover:text-foreground'
              : 'opacity-30 cursor-not-allowed text-muted-foreground',
          )}
          type="button"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
