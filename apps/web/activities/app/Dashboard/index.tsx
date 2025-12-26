import { ActivityLayout } from "@/common/components/ActivityLayout";
import { UserMenu } from "@/common/components/ActivityLayout/UserMenu";
import Loading from "@/common/components/Loading";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { EventShareSheet } from "../calendar/Result/components/EventShareSheet";
import { CalendarList } from "./components/CalendarList";
import { DashboardFilter } from "./components/DashboardFilter";
import { DashboardMenuSheet } from "./components/DashboardMenuSheet";
import { DashboardParticipantSheet } from "./components/DashboardParticipantSheet";
import { useDashboard } from "./hooks/useDashboard";
import { useDashboardStore } from "./hooks/useDashboardStore";
import { ShareCalendarSheet } from "@/common/components/ShareCalendarSheet";
import { Button } from "@repo/ui";



export default function Dashboard() {
    const { user, handleCreateSchedule } = useDashboard();
    const { isShareOpen, closeShare, isMenuOpen, closeMenu, isParticipantOpen, closeParticipant, calendar } = useDashboardStore();


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
                        <CalendarList user={user} />
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


            <ShareCalendarSheet
                title={calendar?.isConfirmed ? "일정 공유하기" : "캘린더 공유하기"}
                description={calendar?.isConfirmed ? "친구들에게 일정을 공유해보세요." : "친구들에게 캘린더를 공유해보세요."}
                open={isShareOpen}
                onOpenChange={(open) => !open && closeShare()}
                link={calendar?.isConfirmed ? `${window.location.origin}/app/calendar/${calendar?.id}/results/` : `${window.location.origin}/app/calendar/${calendar?.id}`}
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