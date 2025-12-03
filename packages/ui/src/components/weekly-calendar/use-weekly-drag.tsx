// packages/ui/src/components/weekly-calendar/use-weekly-drag.ts
import { isSameDay, isSameMinute } from 'date-fns';
import { useRef, useEffect, useCallback } from 'react';

interface UseWeeklyDragProps {
  selectedDates: Date[];
  onSelectDates?: (dates: Date[]) => void;
  isDateDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
}

export function useWeeklyDrag({ selectedDates, onSelectDates, isDateDisabled, isSelected }: UseWeeklyDragProps) {
  const isDragging = useRef(false);
  const dragMode = useRef(true); // true = add, false = remove
  const lastProcessedDate = useRef<string | null>(null);

  const toggleDate = useCallback(
    (date: Date, mode: boolean) => {
      if (isDateDisabled(date)) return;

      const exists = selectedDates?.some((d) => isSameMinute(d, date));
      let newDates = [...selectedDates];

      if (mode == exists) return; // if add mode and date exists, or remove mode and date doesn't exist, do nothing

      if (mode && !exists)
        newDates.push(date); // add
      else newDates = newDates.filter((d) => !isSameMinute(d, date)); // remove

      onSelectDates?.(newDates);
    },
    [selectedDates, onSelectDates, isDateDisabled],
  );

  const handleDragStart = (date: Date) => {
    if (isDateDisabled(date)) return;

    isDragging.current = true;
    dragMode.current = !isSelected(date);
    toggleDate(date, dragMode.current);

    lastProcessedDate.current = date.toISOString();
  };

  const handleDragOver = (date: Date) => {
    if (!isDragging.current) return;

    if (lastProcessedDate.current === date.toISOString()) return;
    toggleDate(date, dragMode.current);
    lastProcessedDate.current = date.toISOString();
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    lastProcessedDate.current = null;
  };

  return {
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
  };
}
