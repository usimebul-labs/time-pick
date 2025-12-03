"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils"; // 요청하신 경로

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  className?: string;
}

export function CalendarHeader({ 
  currentMonth, 
  onPrevMonth, 
  onNextMonth,
  canGoPrev,
  canGoNext,
  className 
}: CalendarHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <h2 className="font-semibold text-lg ml-1">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <div className="flex gap-1">
        <button
          onClick={onPrevMonth}
          disabled={!canGoPrev}
          className={cn(
            "p-2 rounded-md transition-colors",
            canGoPrev 
              ? "hover:bg-accent text-muted-foreground hover:text-foreground" 
              : "opacity-30 cursor-not-allowed text-muted-foreground"
          )}
          type="button"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNextMonth}
          disabled={!canGoNext}
          className={cn(
            "p-2 rounded-md transition-colors",
            canGoNext 
              ? "hover:bg-accent text-muted-foreground hover:text-foreground" 
              : "opacity-30 cursor-not-allowed text-muted-foreground"
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