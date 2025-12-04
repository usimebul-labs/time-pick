import { format } from 'date-fns';
import { useCalendarHeader } from './hook/use-calendar-header';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarHeaderProps = ReturnType<typeof useCalendarHeader>;

export function CalendarHeader({ calendarDate, canNext, canPrev, goToNext, goToPrev, goToToday }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background z-10">
      <h2 className="text-lg font-semibold">{format(calendarDate, 'yyyy년 M월', { locale: ko })}</h2>
      <div className="flex items-center gap-1">
        <button
          onClick={goToPrev}
          disabled={!canPrev}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={goToToday} className="px-2 py-1 text-xs font-medium border rounded hover:bg-muted">
          오늘
        </button>
        <button
          onClick={goToNext}
          disabled={!canNext}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
