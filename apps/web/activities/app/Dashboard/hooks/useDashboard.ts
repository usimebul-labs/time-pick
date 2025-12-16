import { DashboardEvent, deleteEvent } from "@/app/actions/calendar";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useFlow } from "../../../../stackflow";

// Constants
export const INITIAL_DISPLAY_COUNT = 3;

export function useDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [mySchedules, setMySchedules] = useState<DashboardEvent[]>([]);
    const [joinedSchedules, setJoinedSchedules] = useState<DashboardEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // Show More State
    const [showAllMySchedules, setShowAllMySchedules] = useState(false);
    const [showAllJoinedSchedules, setShowAllJoinedSchedules] = useState(false);

    // Share Dialog State
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareEventId, setShareEventId] = useState<string | null>(null);

    // Menu Sheet State
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuScheduleId, setMenuScheduleId] = useState<string | null>(null);

    // Participant Sheet State
    const [participantSheetOpen, setParticipantSheetOpen] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<{ name: string; avatarUrl: string | null; userId: string | null }[]>([]);
    const [selectedParticipantCount, setSelectedParticipantCount] = useState(0);

    const supabase = createClient();
    const { push } = useFlow();

    useEffect(() => {
        const init = async () => {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        init();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    const handleCreateSchedule = () => {
        push("CreateBasicInfo", {});
    };

    const handleManage = (id: string) => {
        setMenuOpen(false);
        push("Result", { id });
    };

    const handleConfirm = (id: string) => {
        setMenuOpen(false);
        push("Confirm", { id });
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
            const { success, error } = await deleteEvent(id);
            if (success) {
                setMySchedules(prev => prev.filter(s => s.id !== id));
                setMenuOpen(false);
            } else {
                alert(error || "삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const handleShare = (id: string) => {
        setShareEventId(id);
        setShareDialogOpen(true);
    };

    const handleShareClose = () => {
        setShareDialogOpen(false);
        setShareEventId(null);
    };

    const handleMenuOpen = (id: string) => {
        setMenuScheduleId(id);
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
        setMenuScheduleId(null);
    };

    const handleParticipantClick = (participants: { name: string; avatarUrl: string | null; userId: string | null }[], count: number) => {
        const sorted = [...participants].sort((a, b) => {
            const isMeA = user && a.userId === user.id;
            const isMeB = user && b.userId === user.id;
            if (isMeA) return -1;
            if (isMeB) return 1;

            const isSocialA = !!a.userId;
            const isSocialB = !!b.userId;
            if (isSocialA && !isSocialB) return -1;
            if (!isSocialA && isSocialB) return 1;

            return 0;
        });

        setSelectedParticipants(sorted);
        setSelectedParticipantCount(count);
        setParticipantSheetOpen(true);
    };

    const handleCardClick = (id: string) => {
        push("Select", { id });
    };

    const handleModify = (id: string) => {
        setMenuOpen(false);
        push("Modify", { id });
    };

    return {
        user,
        mySchedules,
        joinedSchedules,
        loading,
        showAllMySchedules,
        setShowAllMySchedules,
        showAllJoinedSchedules,
        setShowAllJoinedSchedules,
        shareDialogOpen,
        shareEventId,
        menuOpen,
        menuScheduleId,
        participantSheetOpen,
        setParticipantSheetOpen,
        selectedParticipants,
        selectedParticipantCount,
        handleSignOut,
        handleCreateSchedule,
        handleManage,
        handleModify,
        handleConfirm,
        handleDelete,
        handleShare,
        handleShareClose,
        handleMenuOpen,
        setMenuOpen,
        handleMenuClose,
        handleParticipantClick,
        handleCardClick
    };
}
