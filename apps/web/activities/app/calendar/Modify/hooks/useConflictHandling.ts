import { startTransition } from "react";
import { useFlow } from "@/stackflow";
import { updateCalendar } from "@/app/actions/calendar";
import { useLoading } from "@/common/components/LoadingOverlay/useLoading";
import { useModifyStore } from "../stores/useModifyStore";

export function useConflictHandling(id: string) {
    const { replace } = useFlow();
    const { show, hide } = useLoading();
    const { pendingFormData, clearConflict } = useModifyStore();

    const handleConfirmConflict = async () => {
        if (!pendingFormData) return;
        clearConflict(); // Close dialog immediately

        startTransition(async () => {
            show();
            const result = await updateCalendar(id, pendingFormData, true); // Confirm delete
            if (result.success) {
                hide();
                replace("Dashboard", {});
            } else {
                alert(result.error || "수정 중 오류가 발생했습니다.");
                hide();
            }
        });
    };

    return { handleConfirmConflict };
}
