import { useCreateCalendarStore } from "./useCreateCalendarStore";
import { useFlow } from "../../../../../stackflow";

import { useRedirectCheck } from "./useRedirectCheck";

export function useCalendarType() {
    const { isValid } = useRedirectCheck();
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();

    const handleNext = () => {
        push("CreateDateRange", {});
    };

    return {
        data,
        updateData,
        handleNext,
        isValid,
    };
}
