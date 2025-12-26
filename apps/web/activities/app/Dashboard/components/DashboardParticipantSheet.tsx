import { ParticipantList } from "@/common/components/participant/ParticipantList";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { useDashboardStore } from "../hooks/useDashboardStore";

interface DashboardParticipantSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function DashboardParticipantSheet({ open, onOpenChange, user }: DashboardParticipantSheetProps) {
    const { calendar } = useDashboardStore();

    if (!calendar) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent portal={false} side="bottom" className="rounded-t-xl h-[55vh] p-0 bg-white flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b border-gray-100 shrink-0">
                    <SheetTitle className="text-lg font-bold text-slate-900">참여자 목록
                        <span className="text-indigo-600 ml-1">{calendar.participants.length}명</span>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex-1 p-4 pb-20 overflow-y-auto content-start">
                    <ParticipantList
                        participants={calendar.participants.map(p => ({ ...p, id: p.userId || p.name }))}
                        interaction="readonly"
                        currentUser={user}
                        className="gap-1"
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
