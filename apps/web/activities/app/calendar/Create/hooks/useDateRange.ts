import { useEffect, useState } from "react";
import { useCreateCalendarStore } from "./useCreateCalendarStore";
import { useFlow } from "../../../../../stackflow";

import { useRedirectCheck } from "./useRedirectCheck";

export function useDateRange() {
    const { isValid } = useRedirectCheck();
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isUndefined, setIsUndefined] = useState(false);

    // Helper: Format Date to YYYY-MM-DD
    const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (data.scheduleType === "datetime") {
            const getEndOfMonthStr = () => {
                const d = new Date();
                return formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
            };

            const getEndOfWeekStr = () => {
                const d = new Date();
                const day = d.getDay(); // 0 (Sun) to 6 (Sat)
                const diff = 6 - day; // Days to add to reach Saturday
                const endOfWeek = new Date(d);
                endOfWeek.setDate(d.getDate() + diff);
                return formatDate(endOfWeek);
            };

            const targetDate = getEndOfWeekStr();
            // If the current endDate is the default (End of Month), update it to End of Week
            if (data.endDate === getEndOfMonthStr() && data.endDate !== targetDate) {
                updateData({ endDate: targetDate });
            }
        }
    }, [data.scheduleType, data.endDate, updateData]);

    const handleUndefinedChange = (checked: boolean) => {
        setIsUndefined(checked);
        if (checked) {
            // Optional: Set specific flag or just disable inputs visually
        }
    };

    const handleNext = () => {
        if (!isUndefined && (!data.startDate || !data.endDate)) {
            alert("시작일과 종료일을 설정해주세요.");
            return;
        }
        push("CreateExclusions", {});
    };

    return {
        data,
        updateData,
        isUndefined,
        handleUndefinedChange,
        handleNext,
        isValid,
    };
}
