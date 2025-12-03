"use client";

import { useRef } from "react";
import { cn } from "../../lib/utils"; // 요청하신 경로
import type { useMonthlyCalendar } from "./use-monthly-calendar";

type CalendarLogic = ReturnType<typeof useMonthlyCalendar>;

interface CalendarGridProps {
  calendarDays: Date[];
  getDayProps: CalendarLogic["getDayProps"];
  dragHandlers: CalendarLogic["dragHandlers"];
}

export function CalendarGrid({ calendarDays, getDayProps, dragHandlers }: CalendarGridProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Mobile Touch Logic (elementFromPoint) ---
  const handleTouchMove = (e: React.TouchEvent) => {    
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // 버튼 내부의 span이나 다른 요소를 찍어도 부모 button을 찾도록 closest 사용 권장
    // 여기서는 data-date가 button에 있으므로 target에서 바로 확인
    const dateAttr = target?.getAttribute("data-date") || target?.closest("button")?.getAttribute("data-date");
    
    if (dateAttr) {
      dragHandlers.onDragOver(new Date(dateAttr));
    }
  };

  return (
    <div className="flex flex-col gap-2 select-none">
      <div className="grid grid-cols-7 text-center">
        {weekDays.map((day) => (
          <div key={day} className="text-muted-foreground text-xs font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div 
        ref={containerRef}
        className="grid grid-cols-7 gap-1 auto-rows-fr touch-none"
        onMouseLeave={dragHandlers.onDragEnd}
        onMouseUp={dragHandlers.onDragEnd}
        onTouchEnd={dragHandlers.onDragEnd}
        onTouchMove={handleTouchMove}
      >
        {calendarDays.map((day) => {
          const { isCurrentMonth, isSelected, isToday, isDisabled } = getDayProps(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              data-date={day.toISOString()}
              disabled={isDisabled}
              
              // Mouse Interactions
              onPointerDown={() => dragHandlers.onDragStart(day)}
              onMouseEnter={() => dragHandlers.onDragOver(day)}
              
              
              className={cn(
                "h-10 w-full rounded-md flex items-center justify-center text-sm relative transition-all duration-200",
                
                // Disabled State
                isDisabled && "opacity-20 cursor-not-allowed text-muted-foreground line-through decoration-slate-400",

                // Active State
                !isDisabled && [
                  !isCurrentMonth && "text-muted-foreground/30",
                  isCurrentMonth && "text-foreground",
                  
                  // Hover Effect (Desktop)
                  "hover:bg-accent hover:text-accent-foreground",

                  // Selected State
                  isSelected && "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground",
                  
                  // Today Indicator (if not selected)
                  isToday && !isSelected && "bg-accent/50 text-accent-foreground font-semibold ring-1 ring-inset ring-accent-foreground/20"
                ]
              )}
            >
              {day.getDate()}
              
              {/* Selected Indicator (Optional Checkmark or Dot) */}
              {isSelected && (
                <span className="absolute bottom-1 w-1 h-1 bg-primary-foreground rounded-full opacity-70" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}