import { Avatar, AvatarFallback, AvatarImage, cn } from "@repo/ui";
import { SharedParticipant } from "@/common/types/participant";
import { User } from "@supabase/supabase-js";
import { MouseEventHandler } from "react";

interface ParticipantFacepileProps {
    participants: SharedParticipant[];
    maxFacepile?: number;
    overflowIndicator?: "count" | "icon";
    currentUser?: User | null;
    currentUserId?: string | null;
    onFacepileClick?: MouseEventHandler<HTMLDivElement>;
    className?: string;
    itemClassName?: string;
}

export function ParticipantFacepile({
    participants,
    maxFacepile = 5,
    overflowIndicator = "count",
    currentUser,
    currentUserId,
    onFacepileClick,
    className,
    itemClassName
}: ParticipantFacepileProps) {
    const isMe = (p: SharedParticipant) => {
        const myId = currentUser?.id || currentUserId;
        return myId && p.userId === myId;
    };

    const sortedParticipants = [...participants].sort((a, b) => {
        if (isMe(a)) return -1;
        if (isMe(b)) return 1;
        return 0; // Simple sort for now
    });

    const showMore = participants.length > maxFacepile;
    // Reserve 1 spot for overflow indicator
    const effectiveDisplayCount = showMore ? maxFacepile - 1 : maxFacepile;
    const displayParticipants = sortedParticipants.slice(0, effectiveDisplayCount);
    const extraCount = participants.length - effectiveDisplayCount;

    return (
        <div
            className={cn("flex items-center -space-x-3 transition-opacity", onFacepileClick && "cursor-pointer hover:opacity-80", className)}
            onClick={onFacepileClick}
        >
            {displayParticipants.map((p, i) => (
                <div key={p.id || i} className={cn("relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-white", itemClassName)} title={p.name}>
                    <Avatar className="w-full h-full">
                        <AvatarImage src={p.avatarUrl || undefined} alt={p.name} />
                        <AvatarFallback className="text-[10px] bg-gray-200 text-gray-600 font-medium">
                            {p.name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
            ))}
            {showMore && (
                <div className={cn("relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center z-10 ring-2 ring-white text-gray-600 font-bold", itemClassName)}>
                    {overflowIndicator === "count" ? (
                        <span className="text-[10px]">+{extraCount}</span>
                    ) : (
                        <span className="text-xs pb-1 tracking-widest text-slate-400">...</span>
                    )}
                </div>
            )}
        </div>
    );
}
