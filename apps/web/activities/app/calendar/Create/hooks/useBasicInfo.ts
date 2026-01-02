import { useEffect } from "react";
import { useCreateCalendarStore } from "./useCreateCalendarStore";
import { useFlow } from "../../../../../stackflow";

export function useBasicInfo() {
    const { push } = useFlow();
    const { data, updateData, resetData } = useCreateCalendarStore();

    useEffect(() => {
        resetData();
    }, []);

    const handleNext = () => {
        if (!data.title || !data.title.trim()) {
            alert("일정 제목을 입력해주세요.");
            return;
        }
        push("CreateCalendarType", {});
    };

    return {
        data,
        updateData,
        handleNext,
    };
}
