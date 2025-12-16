import { ShareCalendarDialog, Button } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Calendar, CalendarRange, Sparkles } from "lucide-react";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardMenuSheet } from "./components/DashboardMenuSheet";
import { DashboardParticipantSheet } from "./components/DashboardParticipantSheet";
import { ScheduleList } from "./components/ScheduleList";
import { INITIAL_DISPLAY_COUNT, useDashboard } from "./hooks/useDashboard";
import Loading from "@/common/components/Loading";
import { EventItem } from "./components/EventItem";
import { Events } from "./components/Events";

export default function Dashboard() {
    const {
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
        setMenuOpen,
        handleMenuClose,
        handleMenuOpen,
        handleParticipantClick,
        handleCardClick
    } = useDashboard();

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
                        <Events user={user} type="my" />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                <Sparkles className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                                참여 중인 일정
                            </h2>
                        </div>
                        <Events user={user} type="joined" />
                    </section>
                </div>
            </div>

            <ShareCalendarDialog
                isOpen={shareDialogOpen}
                onClose={handleShareClose}
                link={typeof window !== 'undefined' && shareEventId ? `${window.location.origin}/app/calendar/${shareEventId}` : ''}
            />

            <DashboardMenuSheet
                open={menuOpen}
                onOpenChange={setMenuOpen}
                scheduleId={menuScheduleId}
                onModify={handleModify}
                onConfirm={handleConfirm}
                onDelete={handleDelete}
            />

            {/* 
               Wait, I realized `DashboardMenuSheet` requires `onModify`. 
               And `ScheduleList` relies on `onMenuClick` which is `handleMenuOpen`.
               And `ScheduleList` - `onMenuClick` triggers `handleMenuOpen`.
            */}

            <DashboardParticipantSheet
                open={participantSheetOpen}
                onOpenChange={setParticipantSheetOpen}
                participants={selectedParticipants}
                count={selectedParticipantCount}
                user={user}
            />
        </AppScreen>
    );
}

// I need to fix the `onModify` part.
// The hook `useDashboard.ts` has `handleManage` which goes to `Result`.
// But "Settings/Modify" button goes to `Modify`.
// I should update `useDashboard.ts` first to add `handleModify` or just expose `push`.
// But I can't edit `useDashboard.ts` in this same step easily without complex tool usage.
// Actually, `stackflow` hook is used in `useDashboard`, not here.
// So `Dashboard/index.tsx` cannot call `push` unless I use `useFlow` here too.
// Ideally, `useDashboard` handles all nav.
// I will rewrite `useDashboard.ts` to include `handleModify`.
