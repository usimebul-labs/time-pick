import { useLayoutEffect } from "react";
import { useCreateCalendarStore } from "./useCreateCalendarStore";
import { useFlow } from "../../../../../stackflow";

export function useRedirectCheck() {
    const { replace } = useFlow();
    const { data } = useCreateCalendarStore();

    useLayoutEffect(() => {
        if (!data.title) {
            replace("CreateBasicInfo", {});
        }
    }, [data.title, replace]);

    return { isValid: !!data.title };
}
