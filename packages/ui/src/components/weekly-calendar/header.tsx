// packages/ui/src/components/weekly-calendar/header.tsx
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({ currentDate, canPrev, canNext, onPrev, onNext, onToday }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background z-10">
      <h2 className="text-lg font-semibold">{format(currentDate, 'yyyy년 M월', { locale: ko })}</h2>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={onToday} className="px-2 py-1 text-xs font-medium border rounded hover:bg-muted">
          오늘
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
