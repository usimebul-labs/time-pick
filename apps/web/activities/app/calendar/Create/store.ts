import { create } from "zustand";
import { CreateCalendarData } from "./types";

interface CreateCalendarStore {
    data: CreateCalendarData;
    updateData: (updates: Partial<CreateCalendarData>) => void;
    resetData: () => void;
}

// Helper: Get Today and End of Month
const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const getTodayStr = () => formatDate(new Date());
const getLastDayOfMonthStr = () => {
    const d = new Date();
    return formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
};

const initialData: CreateCalendarData = {
    title: "",
    description: "",
    scheduleType: "date", // Default Monthly
    startDate: getTodayStr(),
    endDate: getLastDayOfMonthStr(),
    startHour: 9,
    endHour: 18,
    enabledDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    excludedDates: [],
    deadline: `${getLastDayOfMonthStr()}T23:59`, // Default deadline
};

export const useCreateCalendarStore = create<CreateCalendarStore>((set) => ({
    data: initialData,
    updateData: (updates) =>
        set((state) => ({
            data: { ...state.data, ...updates },
        })),
    resetData: () => set({ data: initialData }),
}));
