import * as React from "react";
import { cn } from "../lib/utils";

interface HeatmapGridProps {
  dates: Date[];
  hours: number[]; // 0-23
  availability: Record<string, number>; // ISOString -> opacity/count
  onSlotClick: (date: Date, hour: number) => void;
}

export function HeatmapGrid({ dates, hours, availability, onSlotClick }: HeatmapGridProps) {
  return (
    <div
      className="grid gap-1 overflow-x-auto"
      style={{
        gridTemplateColumns: `auto repeat(${dates.length}, minmax(40px, 1fr))`
      }}
    >
      {/* Time Labels Column */}
      <div className="flex flex-col gap-1 pt-8 sticky left-0 bg-background z-10">
        {hours.map((hour) => (
          <div key={hour} className="h-10 text-xs text-muted-foreground flex items-center justify-end pr-2">
            {hour}:00
          </div>
        ))}
      </div>

      {/* Date Columns */}
      {dates.map((date, dateIndex) => (
        <div key={dateIndex} className="flex flex-col gap-1">
          {/* Header */}
          <div className="h-8 text-center text-sm font-medium">
            {date.getDate()}
          </div>

          {/* Slots */}
          {hours.map((hour) => {
            // Construct key logic specific to your app
            const slotKey = `${date.toISOString().split('T')[0]}-${hour}`;
            const intensity = availability[slotKey] || 0; // 0 to 1 scale ideally

            return (
              <button
                key={hour}
                onClick={() => onSlotClick(date, hour)}
                className={cn(
                  "h-10 w-full rounded-sm transition-colors border border-transparent",
                  "hover:border-primary/50 focus:border-primary",
                  intensity === 0 && "bg-muted/20",
                  intensity > 0 && intensity < 0.3 && "bg-primary/20",
                  intensity >= 0.3 && intensity < 0.7 && "bg-primary/50",
                  intensity >= 0.7 && "bg-primary"
                )}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}