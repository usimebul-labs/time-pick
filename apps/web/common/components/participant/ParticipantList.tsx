import { Avatar, AvatarFallback, AvatarImage, cn } from "@repo/ui";
import { SharedParticipant } from "@/common/types/participant";
import { User } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type ParticipantInteraction = "readonly" | "removable";

interface ParticipantListProps {
    participants: SharedParticipant[];
    interaction?: ParticipantInteraction;
    onDelete?: (id: string) => void;

    // For "Me" identification
    currentUser?: User | null;
    currentUserId?: string | null;

    className?: string;
    itemClassName?: string;
}

export function ParticipantList({
    participants,
    interaction = "readonly",
    onDelete,
    currentUser,
    currentUserId,
    className,
    itemClassName
}: ParticipantListProps) {
    const isMe = (p: SharedParticipant) => {
        const myId = currentUser?.id || currentUserId;
        return myId && p.userId === myId;
    };

    if (participants.length === 0) {
        return (
            <div className={cn("p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg", className)}>
                참여자가 없습니다.
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {participants.map((p) => {
                const me = isMe(p);

                return (
                    <div key={p.id} className={cn("flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-slate-50", itemClassName)}>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-1 ring-slate-100">
                                <AvatarImage src={p.avatarUrl || undefined} alt={p.name} />
                                <AvatarFallback className="text-xs bg-indigo-50 text-indigo-700 font-bold">
                                    {p.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 text-sm truncate">
                                        {p.name}
                                    </span>
                                    {me && (
                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">나</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">
                                        {p.userId ? "회원" : "게스트"}
                                    </span>
                                    {p.createdAt && (
                                        <span className="text-xs text-slate-300">
                                            • {format(new Date(p.createdAt), "MM.dd", { locale: ko })}
                                        </span>
                                    )}
                                    {p.email && (
                                        <span className="text-xs text-slate-300">
                                            • {p.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {interaction === "removable" && (
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                onClick={() => onDelete?.(p.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
