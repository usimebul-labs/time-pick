
export interface ModifyFormState {
    title: string;
    description: string;
    scheduleType: "date" | "datetime";
    startDate: string;
    endDate: string;
    startHour: number;
    endHour: number;
    enabledDays: string[];
    excludeHolidays: boolean;
    excludedDates: string[];
    deadline: string;
}

export interface ConflictedParticipant {
    id: string;
    name: string;
}

export interface DayOption {
    id: string;
    label: string;
    isWeekend: boolean;
}
