import { useState } from "react";
import { useCreateCalendarStore } from "../store";
import { useFlow } from "../../../../../stackflow";

export function useDateRange() {
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isUndefined, setIsUndefined] = useState(false);

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
    };
}
