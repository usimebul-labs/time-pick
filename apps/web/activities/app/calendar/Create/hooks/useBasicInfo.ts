import { useCreateCalendarStore } from "../store";
import { useFlow } from "../../../../../stackflow";

export function useBasicInfo() {
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();

    const handleNext = () => {
        if (!data.title) {
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
