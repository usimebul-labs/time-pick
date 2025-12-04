import { useCalendar } from '../hook/use-calendar';
import { MonthlyCalendarProps } from '../monthly';
import { DayHeader } from './day-header';
import { WeekGrid } from './week-grid';

export interface WeeklyCalendarProps extends MonthlyCalendarProps {
  startHour?: number;
  endHour?: number;
}

export function WeeklyCalendar({ calendarDate, selectedDates, onSelectDates, maxDate, minDate, startHour, endHour }: WeeklyCalendarProps) {
  const { days, hours, isDisabled, isSelected } = useCalendar({ type: 'weekly', calendarDate, selectedDates, startHour, endHour, minDate, maxDate });

  return (
    <>
      <DayHeader days={days} isDisabled={isDisabled} />
      <WeekGrid selectedDates={selectedDates} onSelectDates={onSelectDates} days={days} hours={hours} isDisabled={isDisabled} isSelected={isSelected} />
    </>
  );
}
