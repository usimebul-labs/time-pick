// packages/ui/src/components/weekly-calendar/utils.ts
import { format, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";

export const getSlotId = (date: Date, hour: number) => {
  return `${format(date, "yyyy-MM-dd")}-${hour}`;
};

export const isDateDisabled = (day: Date, min?: Date, max?: Date) => {
  if (min && isBefore(day, startOfDay(min))) return true;
  if (max && isAfter(day, endOfDay(max))) return true;
  return false;
};