import { useState, useEffect, useTransition } from "react";
import { useFlow } from "../../../../../stackflow";
import { useCreateCalendarStore } from "../store";
import { createCalendar } from "@/app/actions/calendar";

export function useDeadline() {
    const { replace } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isUnlimited, setIsUnlimited] = useState(!data.deadline);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (checked: boolean) => {
        setIsUnlimited(checked);
        if (checked) {
            updateData({ deadline: undefined });
        } else {
            if (!data.deadline && data.endDate) {
                updateData({ deadline: `${data.endDate}T23:59` });
            } else if (!data.deadline) {
                // Default to tomorrow if no end date
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                updateData({ deadline: tomorrow.toISOString().slice(0, 16) });
            }
        }
    };

    useEffect(() => {
        if (data.deadline && isUnlimited) {
            setIsUnlimited(false);
        }
    }, [data.deadline]);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await createCalendar({ message: "", error: "" }, formData);

            if (result.message === "Success" && result.eventId) {
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("lastCreatedEventId", result.eventId);
                }
                replace("Select", { id: result.eventId });
            } else if (result.error) {
                alert(result.error);
            }
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
