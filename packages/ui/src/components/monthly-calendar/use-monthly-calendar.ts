"use client";

import { useState, useCallback, useRef } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth,
  isSameDay, isToday, isBefore, isAfter, startOfDay, endOfDay
} from "date-fns";

export type CalendarViewProps = {
  selectedDates?: Date[]; // 다중 선택 배열
  onSelectDates?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
};

export function useMonthlyCalendar({
  selectedDates = [],
  onSelectDates,
  minDate,
  maxDate
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDates[0] || new Date());

  // 드래그 상태
  const isDragging = useRef(false);
  const dragMode = useRef<"add" | "remove">("add"); // 현재 드래그가 선택 모드인지 해제 모드인지
  const lastProcessedDate = useRef<string | null>(null); // 중복 처리 방지

  // --- Helper: 날짜 비활성화 체크 ---
  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isAfter(date, endOfDay(maxDate))) return true;
    return false;
  }, [minDate, maxDate]);

  // --- Helper: 날짜 선택 여부 확인 ---
  const isSelected = useCallback((date: Date) => {
    return selectedDates.some(d => isSameDay(d, date));
  }, [selectedDates]);

  // --- Core Logic: 날짜 추가/제거 ---
  const toggleDate = useCallback((date: Date, mode: "add" | "remove") => {
    if (isDateDisabled(date)) return;

    const exists = selectedDates.some(d => isSameDay(d, date));
    let newDates = [...selectedDates];

    if (mode === "add" && !exists) {
      newDates.push(date);
    } else if (mode === "remove" && exists) {
      newDates = newDates.filter(d => !isSameDay(d, date));
    } else {
      return; // 변경사항 없음
    }

    onSelectDates?.(newDates);
  }, [selectedDates, onSelectDates, isDateDisabled]);

  // --- Event Handlers ---
  const handleDragStart = (date: Date) => {
    if (isDateDisabled(date)) return;

    isDragging.current = true;

    // 시작한 날짜의 상태를 보고 모드 결정 (이미 선택됨 -> 해제 모드 / 아니면 -> 추가 모드)
    const currentlySelected = isSelected(date);
    dragMode.current = currentlySelected ? "remove" : "add";

    console.log('Drag Start on', date, 'Mode:', dragMode.current);
    // 시작 날짜 즉시 처리
    toggleDate(date, dragMode.current);
    lastProcessedDate.current = date.toISOString();
  };

  const handleDragOver = (date: Date) => {
    if (!isDragging.current) return;
    // 이미 처리한 날짜면 스킵 (드래그 중 같은 칸에서 계속 이벤트 발생 방지)
    if (lastProcessedDate.current === date.toISOString()) return;

    toggleDate(date, dragMode.current);
    lastProcessedDate.current = date.toISOString();
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    lastProcessedDate.current = null;
  };

  // --- Navigation ---
  const canGoPrev = !minDate || isAfter(startOfMonth(currentMonth), startOfMonth(minDate));
  const canGoNext = !maxDate || isBefore(startOfMonth(currentMonth), startOfMonth(maxDate));

  const nextMonth = () => canGoNext && setCurrentMonth((prev) => addMonths(prev, 1));
  const prevMonth = () => canGoPrev && setCurrentMonth((prev) => subMonths(prev, 1));

  // --- Grid Generation ---
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  const getDayProps = (day: Date) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, monthStart),
    isToday: isToday(day),
    isDisabled: isDateDisabled(day),
    isSelected: isSelected(day),
  });

  return {
    currentMonth,
    calendarDays,
    nextMonth,
    prevMonth,
    getDayProps,
    canGoPrev,
    canGoNext,
    dragHandlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd
    }
  };
}