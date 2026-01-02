import { useFlow } from "../../../../../stackflow";
import { useCreateCalendarStore } from "./useCreateCalendarStore";

const DAYS_OF_WEEK = [
    { id: "Sun", label: "일", isWeekend: true },
    { id: "Mon", label: "월", isWeekend: false },
    { id: "Tue", label: "화", isWeekend: false },
    { id: "Wed", label: "수", isWeekend: false },
    { id: "Thu", label: "목", isWeekend: false },
    { id: "Fri", label: "금", isWeekend: false },
    { id: "Sat", label: "토", isWeekend: true },
];

import { useRedirectCheck } from "./useRedirectCheck";

export function useExclusions() {
    const { isValid } = useRedirectCheck();
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();

    const toggleDay = (dayId: string) => {
        const current = data.enabledDays;
        const next = current.includes(dayId)
            ? current.filter((d) => d !== dayId)
            : [...current, dayId];
        updateData({ enabledDays: next });
    };

    const selectDays = (type: "all" | "weekday" | "weekend") => {
        if (type === "all") {
            const allDays = DAYS_OF_WEEK.map((d) => d.id);
            updateData({ enabledDays: allDays });
        } else if (type === "weekday") {
            const weekdays = DAYS_OF_WEEK.filter((d) => !d.isWeekend).map((d) => d.id);
            updateData({ enabledDays: weekdays });
        } else if (type === "weekend") {
            const weekends = DAYS_OF_WEEK.filter((d) => d.isWeekend).map((d) => d.id);
            updateData({ enabledDays: weekends });
        }
    };

    // Specific Date Exclusions
    const excludedDates = data.excludedDates || [];

    const addExcludedDate = (dateStr: string) => {
        if (!dateStr) return;
        if (excludedDates.includes(dateStr)) return;
        updateData({ excludedDates: [...excludedDates, dateStr] });
    };

    const removeExcludedDate = (dateStr: string) => {
        updateData({
            excludedDates: excludedDates.filter((d: string) => d !== dateStr),
        });
    };

    const toggleHolidays = (checked: boolean) => {
        updateData({ excludeHolidays: checked });
    };

    const handleNext = () => {
        push("CreateDeadline", {});
    };

    return {
        data,
        DAYS_OF_WEEK,
        toggleDay,
        selectDays,
        excludedDates,
        addExcludedDate,
        removeExcludedDate,
        handleNext,
        toggleHolidays,
        isValid,
    };
}
