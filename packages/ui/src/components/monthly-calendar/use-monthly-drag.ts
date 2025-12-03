"use client";

import { useRef, useCallback } from "react";
import { isSameDay } from "date-fns";

type UseMonthlyDragProps = {
  value: Date[];
  onChange?: (dates: Date[]) => void;
  isDateDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
};

export function useMonthlyDrag({
  value: selectedDates,
  onChange: onSelectDates,
  isDateDisabled,
  isSelected,
}: UseMonthlyDragProps) {
  const isDragging = useRef(false);
  const dragMode = useRef<"add" | "remove">("add");
  const lastProcessedDate = useRef<string | null>(null);

  const toggleDate = useCallback((date: Date, mode: "add" | "remove") => {
    if (isDateDisabled(date)) return;

    const exists = selectedDates.some(d => isSameDay(d, date));
    let newDates = [...selectedDates];

    if (mode === "add" && !exists) {
      newDates.push(date);
    } else if (mode === "remove" && exists) {
      newDates = newDates.filter(d => !isSameDay(d, date));
    } else {
      return;
    }

    onSelectDates?.(newDates);
  }, [selectedDates, onSelectDates, isDateDisabled]);

  const handleDragStart = (date: Date) => {
    if (isDateDisabled(date)) return;
    isDragging.current = true;
    const currentlySelected = isSelected(date);
    dragMode.current = currentlySelected ? "remove" : "add";
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