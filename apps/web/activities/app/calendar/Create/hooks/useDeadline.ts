import { useState, useEffect, useTransition } from "react";
import { useCreateCalendarStore } from "./useCreateCalendarStore";
import { createCalendar } from "@/app/actions/calendar";
import { useLoading } from "@/common/components/LoadingOverlay/useLoading";
import { useQueryClient } from "@tanstack/react-query";
import { useFlow } from "@/stackflow";

import { useRedirectCheck } from "./useRedirectCheck";

export function useDeadline() {
    const { isValid } = useRedirectCheck();
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isUnlimited, setIsUnlimited] = useState(!data.deadline);
    const [isPending, startTransition] = useTransition();
    const { show, hide } = useLoading();
    const queryClient = useQueryClient();


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
                const calendarId = result.calendarId;
                sessionStorage.setItem("lastCreatedEventId", calendarId);

                // Invalidate dashboard query to refresh list without page reload
                await queryClient.invalidateQueries({ queryKey: ["calendars"] });

                setTimeout(() => {
                    push("Select", { id: calendarId });
                }, 0);
            } else if (result.error && typeof result.error === 'string') alert(result.error);
        });
    };

    return {
        data,
        updateData,
        isUnlimited,
        handleToggle,
        handleSubmit,
        isPending,
        isValid,
    };
}
