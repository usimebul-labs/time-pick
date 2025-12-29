import { DashboardCalendar, deleteCalendar } from "@/app/actions/calendar";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useFlow } from "../../../../stackflow";
import { useDashboardStore } from "./useDashboardStore";

import { useQueryClient } from "@tanstack/react-query";

// Constants
export const INITIAL_DISPLAY_COUNT = 3;

export function useDashboardMenu(user: User) {
    const { closeMenu } = useDashboardStore();
    const { push } = useFlow();
    const queryClient = useQueryClient();

    const handleCreateSchedule = () => {
        push("CreateBasicInfo", {});
    };

    const handleManage = (id: string) => {
        closeMenu();
        push("Result", { id });
    };

    const handleConfirm = (id: string) => {
        closeMenu();
        push("Confirm", { id });
    };

    const handleModify = (id: string) => {
        closeMenu();
        push("Modify", { id });
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
            const { success, error } = await deleteCalendar(id);
            if (!success) {
                alert(error || "삭제 중 오류가 발생했습니다.");
                return
            }

            queryClient.invalidateQueries({ queryKey: ['calendars', user?.id] });
            closeMenu();
        }
    };


    return {
        handleCreateSchedule,
        handleManage,
        handleModify,
        handleConfirm,
        handleDelete,
    };
}
