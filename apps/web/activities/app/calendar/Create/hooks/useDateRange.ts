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
        if (isUndefined) {
            push("CreateExclusions", {});
            return;
        }

        if (!data.startDate || !data.endDate) {
            alert("시작일과 종료일을 설정해주세요.");
            return;
        }

        // Validate Past Date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        // start date comes from input=date which is YYYY-MM-DD (local time usually interpreted as UTC 00:00 or local 00:00 depending on parsing?)
        // new Date('YYYY-MM-DD') parses as UTC.
        // But today is local.
        // Let's use string comparison for safety if we stick to 'YYYY-MM-DD' from inputs.
        // Or create Date from parts.
        const [sy, sm, sd] = data.startDate.split('-').map(Number);

        if (!sy || !sm || !sd) return;
        const startDateObj = new Date(sy, sm - 1, sd); // Local 00:00

        if (startDateObj < today) {
            alert("오늘 이전의 날짜는 선택할 수 없습니다.");
            return;
        }

        if (start > end) {
            alert("종료일은 시작일보다 빠를 수 없습니다.");
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
