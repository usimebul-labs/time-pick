import { Avatar, AvatarFallback, AvatarImage, Sheet, SheetContent, SheetHeader, SheetTitle } from "@repo/ui";
import { User } from "@supabase/supabase-js";

interface DashboardParticipantSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    participants: { name: string; avatarUrl: string | null; userId: string | null }[];
    count: number;
    user: User | null;
}

export function DashboardParticipantSheet({
    open,
    onOpenChange,
    participants,
    count,
    user
}: DashboardParticipantSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-2xl h-[55vh] p-0 bg-white flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b border-gray-100 shrink-0">
                    <SheetTitle className="text-lg font-bold">참여자 목록 <span className="text-indigo-600 ml-1">{count}명</span></SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-1 gap-1 overflow-y-auto flex-1 p-4 pb-20 content-start">
                    {participants.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                            <Avatar className="h-10 w-10 ring-1 ring-gray-100">
                                <AvatarImage src={p.avatarUrl || ""} alt={p.name} />
                                <AvatarFallback className="text-xs bg-indigo-50 text-indigo-600 font-bold">
                                    {p.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 truncate">
                                        {p.name}
                                    </span>
                                    {user && p.userId === user.id && (
                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">나</span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {p.userId ? "회원" : "게스트"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
