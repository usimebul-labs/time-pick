import { useFlow } from "@/stackflow";
import { confirmCalendar } from "@/app/actions/calendar";
import { useLoading } from "@/common/components/LoadingOverlay/useLoading";
import { useConfirmStore } from "../stores/useConfirmStore";
import { RankedSlot } from "../types";
import { CalendarDetail } from "@/app/actions/calendar";

interface UseConfirmFormProps {
    id: string;
    calendar?: CalendarDetail | null;
    rankedSlots: RankedSlot[];
}

export function useConfirmForm({ id, calendar, rankedSlots }: UseConfirmFormProps) {
    const { replace } = useFlow();
    const { show, hide } = useLoading();
    const {
        selectedRankIndex,
        selectedTime,
        selectedEndTime,
        additionalInfo,
        setIsSubmitting
    } = useConfirmStore();

    const handleConfirm = async () => {
        if (!calendar || selectedRankIndex === null) return;

        const selectedSlot = rankedSlots[selectedRankIndex];
        if (!selectedSlot) return; // Should not happen

        let finalStart = selectedSlot.startISO;
        let finalEnd = selectedSlot.endISO;

        if (calendar.type === 'monthly') {
            // Combine date (YYYY-MM-DD) with selectedTime (HH:mm)
            const combinedStart = new Date(`${selectedSlot.startISO}T${selectedTime}:00`);
            finalStart = combinedStart.toISOString();

            if (selectedEndTime) {
                const combinedEnd = new Date(`${selectedSlot.startISO}T${selectedEndTime}:00`);
                finalEnd = combinedEnd.toISOString();
            } else {
                finalEnd = undefined;
            }
        }

        setIsSubmitting(true);
        show();
        try {
            const result = await confirmCalendar(id, {
                startTime: finalStart,
                endTime: finalEnd
            }, selectedSlot.participants, additionalInfo);

            if (result.success) {
                replace("Result", { id });
            } else {
                alert(result.error || "Failed to confirm event");
            }
        } finally {
            hide();
            setIsSubmitting(false);
        }
    };

    return { handleConfirm };
}
