import Loading from "@/common/components/Loading";
import { useEffect } from "react";
import { ShareCalendarDialog, Button } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Calendar, Sparkles, Plus } from "lucide-react";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardMenuSheet } from "./components/DashboardMenuSheet";
import { DashboardParticipantSheet } from "./components/DashboardParticipantSheet";
import { CalendarList } from "./components/CalendarList";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardStore } from "./hooks/useDashboardStore";

export default function Dashboard() {
    const { user, handleCreateSchedule, handleModify, handleConfirm, handleDelete, } = useDashboard();
    const { isShareOpen, closeShare, shareEventId, isMenuOpen, closeMenu, menuEventId,
        isParticipantOpen, closeParticipant, selectedParticipants, selectedParticipantCount, } = useDashboardStore();

    useEffect(() => {
        closeShare();
        closeMenu();
        closeParticipant();
    }, []);

    if (!user) return <Loading />

    return (
        <AppScreen>
            <div className="flex flex-col flex-1 bg-slate-50 min-h-screen h-full pb-32 relative">
                <DashboardHeader user={user} />

                <div className="flex-1 p-5 space-y-8 overflow-y-auto">
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                                내 일정
                            </h2>
                        </div>
                        <CalendarList user={user} type="my" />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                <Sparkles className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                                참여 중인 일정
                            </h2>
                        </div>
                        <CalendarList user={user} type="joined" />
                    </section>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10">
                    <Button
                        size="xl"
                        className="w-full font-bold shadow-lg rounded-xl"
                        onClick={handleCreateSchedule}
                    >
                        <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} /> 새 일정 만들기
                    </Button>
                </div>
            </div>

            <ShareCalendarDialog
                isOpen={isShareOpen}
                onClose={closeShare}
                link={shareEventId ? `${window.location.origin}/app/calendar/${shareEventId}` : ''}
                portal={false}
            />

            <DashboardMenuSheet
                open={isMenuOpen}
                onOpenChange={(open) => !open && closeMenu()}
                eventId={menuEventId}
                onModify={handleModify}
                onConfirm={handleConfirm}
                onDelete={handleDelete}
            />

            <DashboardParticipantSheet
                open={isParticipantOpen}
                onOpenChange={(open) => !open && closeParticipant()}
                participants={selectedParticipants}
                count={selectedParticipantCount}
                user={user}
            />
        </AppScreen>
    );
}