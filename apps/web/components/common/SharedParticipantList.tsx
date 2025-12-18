import { Avatar, AvatarFallback, AvatarImage, cn } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { Trash2, User as UserIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export interface SharedParticipant {
    id: string;
    name: string;
    avatarUrl: string | null;
    userId?: string | null; // For identifying if it's a registered user
    email?: string | null;
    createdAt?: string;
    isGuest?: boolean;
}

export type ParticipantListMode = "grid" | "list" | "facepile";
export type ParticipantInteraction = "readonly" | "selectable" | "removable";

interface SharedParticipantListProps {
    participants: SharedParticipant[];
    mode: ParticipantListMode;
    interaction?: ParticipantInteraction;

    // For selection (grid mode)
    selectedIds?: Set<string> | string[];
    onToggle?: (id: string) => void;

    // For removal (list mode)
    onDelete?: (id: string) => void;

    // For "Me" identification
    currentUser?: User | null;
    currentUserId?: string | null;

    // Facepile specific
    maxFacepile?: number;
    onFacepileClick?: () => void;

    // For highlighting (e.g. available in slot)
    highlightedIds?: Set<string> | string[];

    // Custom class names
    className?: string;
    itemClassName?: string;
}

export function SharedParticipantList({
    participants,
    mode,
    interaction = "readonly",
    selectedIds,
    onToggle,
    onDelete,
    currentUser,
    currentUserId,
    maxFacepile = 5,
    onFacepileClick,
    highlightedIds,
    className,
    itemClassName
}: SharedParticipantListProps) {
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

    // --- Facepile Mode ---
    if (mode === "facepile") {
        const sortedParticipants = [...participants].sort((a, b) => {
            if (isMe(a)) return -1;
            if (isMe(b)) return 1;
            return 0; // Simple sort for now
        });

        const showMore = participants.length > maxFacepile;
        const displayCount = showMore ? maxFacepile - 1 : maxFacepile; // Reserve 1 spot for +N if needed, usually facepiles do this
        // Actually the original implementation did: showMore ? 3 : maxDisplay(5). Let's stick to a simpler logic or mimic original:
        // Original: if > 5, show 3 and +N. Let's make it configurable but default to sensible.
        const effectiveDisplayCount = showMore ? maxFacepile - 2 : maxFacepile;
        const displayParticipants = sortedParticipants.slice(0, effectiveDisplayCount);
        const extraCount = participants.length - effectiveDisplayCount;

        return (
            <div
                className={cn("flex items-center -space-x-3 transition-opacity", onFacepileClick && "cursor-pointer hover:opacity-80", className)}
                onClick={onFacepileClick}
            >
                {displayParticipants.map((p, i) => (
                    <div key={p.id || i} className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-white" title={p.name}>
                        <Avatar className="w-full h-full">
                            <AvatarImage src={p.avatarUrl || undefined} alt={p.name} />
                            <AvatarFallback className="text-[10px] bg-gray-200 text-gray-600 font-medium">
                                {p.name[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                ))}
                {showMore && (
                    <div className="relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center z-10 ring-2 ring-white">
                        <span className="text-[10px] text-gray-600 font-bold">+{extraCount}</span>
                    </div>
                )}
            </div>
        );
    }

    // --- Grid Mode ---
    if (mode === "grid") {
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
                                // Highlight + Active: Just keep active style, maybe enhance?
                                // User said: "Available participants via Border". "Selected via Background/Font".
                                // So maybe they want BOTH visible at same time.
                                // If I am filtered (Selected) AND Available (Highlighted), I should show both.
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

    // --- List Mode ---
    if (mode === "list") {
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

    return null;
}
