import { useCreateCalendarStore } from "./useCreateCalendarStore";
import { useFlow } from "../../../../../stackflow";

export function useCalendarType() {
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();

    const handleNext = () => {
        push("CreateDateRange", {});
    };

    return {
        data,
        updateData,
        handleNext,
    };
}
