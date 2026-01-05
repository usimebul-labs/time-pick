import { ActivityLayout } from "@/common/components/ActivityLayout";
import { UserMenu } from "@/common/components/ActivityLayout/UserMenu";
import Loading from "@/common/components/Loading";
import { ShareCalendarSheet } from "@/common/components/ShareCalendarSheet";
import { Button } from "@repo/ui";
import { bulkDeleteCalendars } from "@/app/actions/calendar/bulk-delete";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { CalendarList } from "./components/CalendarList";
import { DashboardFilter } from "./components/DashboardFilter";
import { DashboardMenuSheet } from "./components/DashboardMenuSheet";
import { DashboardParticipantSheet } from "./components/DashboardParticipantSheet";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardCalendars } from "./hooks/useDashboardCalendars";
import { useDashboardStore } from "./hooks/useDashboardStore";



export default function Dashboard() {
    const { user, handleCreateSchedule } = useDashboard();
    const { isShareOpen, closeShare, isMenuOpen, closeMenu,
        isParticipantOpen, closeParticipant, selectedCalendar,
        isSelectionMode, selectedIds, unselectAll, toggleSelectionMode
    } = useDashboardStore();

    const { calendars, loading, error } = useDashboardCalendars(user!);
    const queryClient = useQueryClient();

    useEffect(() => {
        closeShare();
        closeMenu();
        closeParticipant();
    }, []);

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        if (confirm(`선택한 ${selectedIds.length}개의 일정을 삭제하시겠습니까?`)) {
            const { success, error } = await bulkDeleteCalendars(selectedIds);
            if (success) {
                await queryClient.invalidateQueries({ queryKey: ['calendars', user?.id] });
                unselectAll();
                toggleSelectionMode();
            } else {
                alert(error || "삭제에 실패했습니다.");
            }
        }
    };

    if (!user) return <Loading />

    return (
        <ActivityLayout appBar={{ title: "Time Pick", right: <UserMenu user={user} />, hideBack: true }}>
            <div className="flex flex-col h-full bg-slate-50">
                <div className="flex-1 p-5 overflow-hidden flex flex-col">
                    <DashboardFilter calendars={calendars} />

                    <div className="flex-1 overflow-y-auto">
                        <CalendarList user={user} calendars={calendars} loading={loading} error={error} />
                    </div>
                </div>

                <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10 fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto">
                    {isSelectionMode ? (
                        <Button
                            size="xl"
                            variant="destructive"
                            className="w-full font-bold shadow-lg rounded-xl"
                            onClick={handleBulkDelete}
                            disabled={selectedIds.length === 0}
                        >
                            <Trash2 className="mr-2 h-5 w-5" strokeWidth={2.5} />
                            {selectedIds.length > 0 ? `${selectedIds.length}개 일정 삭제하기` : "삭제할 일정을 선택하세요"}
                        </Button>
                    ) : (
                        <Button
                            size="xl"
                            className="w-full font-bold shadow-lg rounded-xl"
                            onClick={handleCreateSchedule}
                        >
                            <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} /> 새 일정 만들기
                        </Button>
                    )}
                </div>
            </div>


            <ShareCalendarSheet
                title={selectedCalendar?.isConfirmed ? "일정 공유하기" : "캘린더 공유하기"}
                description={selectedCalendar?.isConfirmed ? "친구들에게 일정을 공유해보세요." : "친구들에게 캘린더를 공유해보세요."}
                open={isShareOpen}
                onOpenChange={(open) => !open && closeShare()}
                link={selectedCalendar?.isConfirmed ? `${window.location.origin}/app/calendar/${selectedCalendar?.id}/results/` : `${window.location.origin}/app/calendar/${selectedCalendar?.id}/join`}
            />

            <DashboardMenuSheet
                open={isMenuOpen}
                onOpenChange={(open) => !open && closeMenu()}
                user={user}
            />

            <DashboardParticipantSheet
                open={isParticipantOpen}
                onOpenChange={(open) => !open && closeParticipant()}
                user={user}
            />
        </ActivityLayout>
    );
}