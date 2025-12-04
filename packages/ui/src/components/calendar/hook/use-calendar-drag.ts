import { isSameMinute } from "date-fns";
import { useCallback, useRef } from "react";


interface UseCalendarDragProps {
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
  isDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
}

export function useCalendarDrag({ selectedDates, onSelectDates, isDisabled, isSelected }: UseCalendarDragProps) {
  const isDragging = useRef(false);
  const dragMode = useRef(true); // true = add, false = remove
  const lastProcessedDate = useRef<string | null>(null);

  const toggleDate = useCallback(
    (date: Date, mode: boolean) => {
      if (isDisabled(date)) return;

      const exists = selectedDates?.some((d) => isSameMinute(d, date));
      let newDates = [...selectedDates];

      if (mode == exists) return; // if add mode and date exists, or remove mode and date doesn't exist, do nothing

      if (mode && !exists)
        newDates.push(date); // add
      else newDates = newDates.filter((d) => !isSameMinute(d, date)); // remove

      onSelectDates?.(newDates);
    },
    [selectedDates, onSelectDates, isDisabled],
  );

  const onDragStart = (date: Date) => {
    if (isDisabled(date)) return;
    isDragging.current = true;
    dragMode.current = !isSelected(date);
    toggleDate(date, dragMode.current);

    lastProcessedDate.current = date.toISOString();
  }

  const onDragOver = (date: Date) => {
    if (!isDragging.current) return;
    if (lastProcessedDate.current === date.toISOString()) return;

    toggleDate(date, dragMode.current);
    lastProcessedDate.current = date.toISOString();
  }

  const onDragEnd = () => {
    isDragging.current = false;
    lastProcessedDate.current = null;
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch!.clientX, touch!.clientY);

    // 버튼 내부의 span이나 다른 요소를 찍어도 부모 button을 찾도록 closest 사용
    const dateAttr = target?.getAttribute('data-date') || target?.closest('button')?.getAttribute('data-date');
    if (dateAttr) onDragOver(new Date(dateAttr));
  };

  return { onDragStart, onDragOver, onDragEnd, onTouchMove }
}
