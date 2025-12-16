import Loading from "@/common/components/Loading";
import { ShareCalendarDialog } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Calendar, Sparkles } from "lucide-react";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardMenuSheet } from "./components/DashboardMenuSheet";
import { DashboardParticipantSheet } from "./components/DashboardParticipantSheet";
import { EventList } from "./components/EventList";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardStore } from "./hooks/stores";

export default function Dashboard() {
    const { user, handleCreateSchedule, handleModify, handleConfirm, handleDelete, } = useDashboard();
    const { isShareOpen, closeShare, shareEventId, isMenuOpen, closeMenu, menuEventId,
        isParticipantOpen, closeParticipant, selectedParticipants, selectedParticipantCount, } = useDashboardStore();

    if (!user) return <Loading />

    return (
        <AppScreen>
            <div className="flex flex-col flex-1 bg-slate-50 min-h-screen h-full pb-20">
                <DashboardHeader user={user} onCreateSchedule={handleCreateSchedule} />

                <div className="flex-1 p-5 space-y-8 overflow-y-auto">
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                                내 일정
                            </h2>
                        </div>
                        <EventList user={user} type="my" />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                <Sparkles className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                                참여 중인 일정
                            </h2>
                        </div>
                        <EventList user={user} type="joined" />
                    </section>
                </div>
            </div>

            <ShareCalendarDialog
                isOpen={isShareOpen}
                onClose={closeShare}
                link={shareEventId ? `${window.location.origin}/app/calendar/${shareEventId}` : ''}
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