import { startTransition, useState } from "react";
import { useFlow } from "@/stackflow";
import { updateCalendar } from "@/app/actions/calendar";
import { useLoading } from "@/common/components/LoadingOverlay/useLoading";
import { useModifyStore } from "../stores/useModifyStore";

export function useModifyForm(id: string) {
    const { replace } = useFlow();
    const { show, hide } = useLoading();
    const { formState, setIsSubmitting } = useModifyStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("title", formState.title);
        formData.set("description", formState.description);
        formData.set("scheduleType", formState.scheduleType);
        formData.set("startDate", formState.startDate);
        formData.set("endDate", formState.endDate);
        if (formState.scheduleType === 'datetime') {
            formData.set("startHour", formState.startHour.toString());
            formData.set("endHour", formState.endHour.toString());
        }
        formData.set("enabledDays", JSON.stringify(formState.enabledDays));
        formData.set("excludeHolidays", formState.excludeHolidays.toString());
        formData.set("excludedDates", JSON.stringify(formState.excludedDates));

        if (formState.deadline) {
            formData.set("deadline", formState.deadline);
        }

        setIsSubmitting(true);
        startTransition(async () => {
            show();
            // Force update with confirmDelete=true to bypass conflict dialog and auto-delete available times
            const result = await updateCalendar(id, formData, true);

            if (result.success) {
                setIsSubmitting(false);
                hide();
                replace("Dashboard", {});
            } else {
                alert(result.error || "수정 중 오류가 발생했습니다.");
                setIsSubmitting(false);
                hide();
            }
        });
    };

    return { handleSubmit };
}
