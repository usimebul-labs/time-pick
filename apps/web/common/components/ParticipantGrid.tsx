import { Avatar, AvatarFallback, AvatarImage, cn } from "@repo/ui";
import { SharedParticipant } from "@/common/types/participant";
import { User } from "@supabase/supabase-js";

type ParticipantInteraction = "readonly" | "selectable";

interface ParticipantGridProps {
    participants: SharedParticipant[];
    interaction?: ParticipantInteraction;

    // For selection
    selectedIds?: Set<string> | string[];
    onToggle?: (id: string) => void;

    // For "Me" identification
    currentUser?: User | null;
    currentUserId?: string | null;

    // For highlighting
    highlightedIds?: Set<string> | string[];

    className?: string;
    itemClassName?: string;
}

export function ParticipantGrid({
    participants,
    interaction = "readonly",
    selectedIds,
    onToggle,
    currentUser,
    currentUserId,
    highlightedIds,
    className,
    itemClassName
}: ParticipantGridProps) {
    const isSelected = (id: string) => {
        if (!selectedIds) return false;
        if (Array.isArray(selectedIds)) return selectedIds.includes(id);
        return selectedIds.has(id);
    };

    const isHighlighted = (id: string) => {
        if (!highlightedIds) return false;
        if (Array.isArray(highlightedIds)) return highlightedIds.includes(id);
        return highlightedIds.has(id);
    };

    const isMe = (p: SharedParticipant) => {
        const myId = currentUser?.id || currentUserId;
        return myId && p.userId === myId;
    };

    if (participants.length === 0) {
        return (
            <div className={cn("w-full text-center py-8 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2", className)}>
                <span className="text-2xl">👀</span>
                <span className="text-sm text-gray-400 font-medium">참여자가 없습니다.</span>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {participants.map((p) => {
                const active = isSelected(p.id);
                const highlighted = isHighlighted(p.id);
                const me = isMe(p);

                return (
                    <button
                        key={p.id}
                        onClick={() => interaction === "selectable" && onToggle?.(p.id)}
                        disabled={interaction === "readonly"}
                        className={cn(
                            "flex items-center rounded-full px-2 py-1 border transition-all relative",
                            interaction === "selectable" ? "cursor-pointer" : "cursor-default",
                            active
                                ? "bg-indigo-50 border-indigo-200"
                                : "bg-white border-gray-200 hover:bg-gray-50",
                            // Highlight effect: thick border (ring)
                            highlighted && !active && "ring-2 ring-indigo-400 border-transparent",
                            // Highlight + Active combined
                            highlighted && active && "ring-2 ring-indigo-500 ring-offset-1",
                            itemClassName
                        )}
                    >
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mr-1.5 overflow-hidden ring-1 ring-white",
                            active ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
                        )}>
                            <Avatar className="w-full h-full">
                                <AvatarImage src={p.avatarUrl || undefined} alt={p.name} />
                                <AvatarFallback className="text-[9px]">
                                    {p.name[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <span className={cn("text-xs transition-colors", active ? "text-indigo-700 font-semibold" : "text-gray-700")}>
                            {p.name}
                            {me && <span className={cn("text-[10px] ml-1", active ? "text-indigo-600 font-bold" : "text-gray-400")}>(나)</span>}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
