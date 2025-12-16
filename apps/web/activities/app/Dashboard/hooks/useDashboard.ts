import { DashboardEvent, deleteEvent } from "@/app/actions/calendar";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useFlow } from "../../../../stackflow";
import { useDashboardStore } from "../store/useDashboardStore";

// Constants
export const INITIAL_DISPLAY_COUNT = 3;

export function useDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const { closeMenu } = useDashboardStore();

    const supabase = createClient();
    const { push } = useFlow();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        init();
    }, []);

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
            const { success, error } = await deleteEvent(id);
            if (success) {
                // setMySchedules(prev => prev.filter(s => s.id !== id));
                closeMenu();
            } else {
                alert(error || "삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return {
        user,
        handleCreateSchedule,
        handleManage,
        handleModify,
        handleConfirm,
        handleDelete,
    };
}
