// packages/ui/src/components/weekly-calendar/use-weekly-drag.ts
import { useRef, useEffect, useCallback } from 'react';

interface UseWeeklyDragProps {
  selectedSlots: string[];
  onSlotsChange?: (slots: string[]) => void;
  readOnly?: boolean;
}

export function useWeeklyDrag({ selectedSlots, onSlotsChange, readOnly }: UseWeeklyDragProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const dragState = useRef<{
    isDragging: boolean;
    action: 'add' | 'remove' | null;
    lastSlotId: string | null;
  }>({
    isDragging: false,
    action: null,
    lastSlotId: null,
  });

  const handleSlotAction = useCallback(
    (slotId: string) => {
      if (readOnly || !onSlotsChange) return;
      if (dragState.current.lastSlotId === slotId) return;

      dragState.current.lastSlotId = slotId;
      const isSelected = selectedSlots.includes(slotId);

      const action = dragState.current.action ?? (isSelected ? 'remove' : 'add');
      dragState.current.action = action;

      if ((action === 'add' && isSelected) || (action === 'remove' && !isSelected)) return;

      const newSlots = action === 'add' ? [...selectedSlots, slotId] : selectedSlots.filter((id) => id !== slotId);

      onSlotsChange(newSlots);
    },
    [selectedSlots, onSlotsChange, readOnly]
  );

  // --- 이벤트 핸들러 ---
  const onMouseEnter = (e: React.MouseEvent, slotId: string, disabled: boolean) => {
    if (disabled || readOnly || e.buttons !== 1 || !dragState.current.isDragging) return;
    handleSlotAction(slotId);
  };

  const onPointerDown = (e: React.TouchEvent, slotId: string, disabled: boolean) => {
    if (disabled || readOnly) return;
    dragState.current.isDragging = true;
    dragState.current.lastSlotId = null;
    dragState.current.action = null;
    handleSlotAction(slotId);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragState.current.isDragging) return;
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotElement = element?.closest('[data-slot-id]') as HTMLElement;

    if (slotElement?.dataset.slotId) {
      const disabled = slotElement.dataset.disabled === 'true';
      if (!disabled) handleSlotAction(slotElement.dataset.slotId);
    }
  };

  useEffect(() => {
    const handleEnd = () => {
      dragState.current.isDragging = false;
      dragState.current.action = null;
      dragState.current.lastSlotId = null;
    };
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  return { containerRef, handlers: { onMouseEnter, onPointerDown, onTouchMove } };
}
