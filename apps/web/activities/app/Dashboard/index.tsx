import Loading from "@/common/components/Loading";
import { useEffect } from "react";
import { ShareCalendarDialog, Button } from "@repo/ui";
import { ActivityLayout } from "@/common/components/ActivityLayout";
import { Plus } from "lucide-react";
import { DashboardMenuSheet } from "./components/DashboardMenuSheet";
import { DashboardParticipantSheet } from "./components/DashboardParticipantSheet";
import { CalendarList } from "./components/CalendarList";
import { DashboardFilter } from "./components/DashboardFilter";
import { EventShareSheet } from "../calendar/Result/components/EventShareSheet";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardStore } from "./hooks/useDashboardStore";
import { useCalendars } from "./hooks/useCalendars";
import { UserMenu } from "@/common/components/UserMenu";

const ListLoading = () => {
    return (
        <div className="space-y-4 px-1 py-1">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                    {/* Header: Title and Icons */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="h-5 bg-slate-100 rounded-md w-3/5 animate-pulse" />
                        <div className="flex gap-1" >
                            <div className="h-7 w-7 bg-slate-50 rounded-lg animate-pulse" />
                            <div className="h-7 w-7 bg-slate-50 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Body: Date info */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 bg-slate-50 rounded w-16 animate-pulse" />
                        <div className="h-3 w-[1px] bg-slate-100" />
                        <div className="h-3 bg-slate-50 rounded w-20 animate-pulse" />
                    </div>

                    {/* Footer: Participants */}
                    <div className="flex justify-end items-center mt-3 pt-2 border-t border-slate-50">
                        <div className="flex -space-x-1.5">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="w-6 h-6 bg-slate-100 rounded-full ring-2 ring-white animate-pulse" />
                            ))}
                        </div>
                        <div className="ml-2 h-3 w-8 bg-slate-50 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function Dashboard() {
    const { user, handleCreateSchedule, handleModify, handleConfirm, handleDelete, } = useDashboard();
    const { isShareOpen, closeShare, shareEventId, isMenuOpen, closeMenu, menuEventId,
        isParticipantOpen, closeParticipant, selectedParticipants, selectedParticipantCount, } = useDashboardStore();

    // Call useCalendars here
    const { calendars, loading: listLoading, error } = useCalendars(user!);

    // Helper to find shared event
    const sharedEvent = calendars.find(c => c.id === shareEventId);
    const isSharedConfirmed = sharedEvent?.isConfirmed ?? false;

    useEffect(() => {
        closeShare();
        closeMenu();
        closeParticipant();
    }, []);

    if (!user) return <Loading />

    return (
        <ActivityLayout appBar={{
            title: "Time Pick",
            renderRight: () => <UserMenu user={user} />
        }}>
            <div className="flex flex-col h-full bg-slate-50">

                <div className="flex-1 p-5 overflow-hidden flex flex-col">
                    <DashboardFilter />

                    <div className="flex-1 overflow-y-auto">
                        {listLoading ? (
                            <ListLoading />
                        ) : error ? (
                            <div className="text-red-500 text-center py-10">{error}</div>
                        ) : (
                            <CalendarList user={user} calendars={calendars} />
                        )}
                    </div>
                </div>

                <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10 fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto">
                    <Button
                        size="xl"
                        className="w-full font-bold shadow-lg rounded-xl"
                        onClick={handleCreateSchedule}
                    >
                        <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} /> 새 일정 만들기
                    </Button>
                </div>
            </div>

            {/* Share Sheets */}
            {isShareOpen && (
                isSharedConfirmed ? (
                    <EventShareSheet
                        isOpen={isShareOpen}
                        onClose={closeShare}
                        link={shareEventId ? `${window.location.origin}/app/calendar/${shareEventId}/results/` : ''}
                    />
                ) : (
                    <ShareCalendarDialog
                        isOpen={isShareOpen}
                        onClose={closeShare}
                        link={shareEventId ? `${window.location.origin}/app/calendar/${shareEventId}` : ''}
                        portal={false}
                    />
                )
            )}

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
        </ActivityLayout>
    );
}