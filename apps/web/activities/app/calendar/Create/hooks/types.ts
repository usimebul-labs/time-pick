
export interface CreateCalendarData {
    title: string;
    description: string;
    scheduleType: "date" | "datetime";
    startDate: string;
    endDate: string;
    startHour?: number;
    endHour?: number;
    enabledDays: string[];
    excludedDates?: string[];
    deadline?: string;
}
