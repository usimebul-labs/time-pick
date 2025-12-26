import { useState, useEffect, useTransition } from "react";
import { useFlow } from "../../../../../stackflow";
import { useCreateCalendarStore } from "./useCreateCalendarStore";
import { createCalendar } from "@/app/actions/calendar";
import { useLoading } from "@/common/components/LoadingOverlay/useLoading";

export function useDeadline() {
    const { replace } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isUnlimited, setIsUnlimited] = useState(!data.deadline);
    const [isPending, startTransition] = useTransition();
    const { show, hide } = useLoading();


    const handleToggle = (checked: boolean) => {
        setIsUnlimited(checked);
        if (checked) updateData({ deadline: undefined });
        else {
            if (!data.deadline && data.endDate) updateData({ deadline: `${data.endDate}T23:59` });
            else if (!data.deadline) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                updateData({ deadline: tomorrow.toISOString().slice(0, 16) });
            }
        }
    };

    useEffect(() => {
        if (data.deadline && isUnlimited) setIsUnlimited(false);
    }, [data.deadline]);


    useEffect(() => {
        if (isPending) show();
        else hide();
    }, [isPending, show, hide]);


    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await createCalendar({ message: "", error: "" }, formData);

            if (result.message === "Success" && result.calendarId) {
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("lastCreatedEventId", result.calendarId);
                }
                replace("Select", { id: result.calendarId });
            } else if (result.error) alert(result.error);
        });
    };

    return {
        data,
        updateData,
        isUnlimited,
        handleToggle,
        handleSubmit,
        isPending,
    };
}
