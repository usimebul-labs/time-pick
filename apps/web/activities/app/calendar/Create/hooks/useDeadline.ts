import { useState, useEffect, useActionState } from "react";
import { useFlow } from "../../../../../stackflow";
import { useCreateCalendarStore } from "../store";
import { createCalendar, CreateCalendarState } from "@/app/actions/calendar";

const initialState: CreateCalendarState = { message: "", error: "" };

export function useDeadline() {
    const { replace } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isUnlimited, setIsUnlimited] = useState(!data.deadline);
    const [state, formAction] = useActionState(createCalendar, initialState);
    const [showShareDialog, setShowShareDialog] = useState(false);

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

    // Handle Submission Result
    useEffect(() => {
        if (state.message === "Success" && state.eventId) {
            setShowShareDialog(true);
        } else if (state.error) {
            alert(state.error);
        }
    }, [state]);

    const handleShareClose = () => {
        setShowShareDialog(false);
        if (state.eventId) {
            replace("Join", { id: state.eventId }, { animate: false });
        }
    };

    return {
        data,
        updateData,
        isUnlimited,
        handleToggle,
        state,
        formAction,
        showShareDialog,
        handleShareClose,
    };
}
