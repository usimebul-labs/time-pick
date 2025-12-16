import { User } from "@supabase/supabase-js";
import { MouseEventHandler } from "react";

interface ParticipantFacepileProps {
    participants: {
        name: string;
        avatarUrl: string | null;
        userId: string | null;
    }[];
    totalCount: number;
    user: User | null;
    clickHandler: MouseEventHandler<HTMLDivElement>;
}

export function ParticipantFacepile({ participants, totalCount, user, clickHandler }: ParticipantFacepileProps) {
    // Sort participants for display
    const sortedParticipants = [...participants].sort((a, b) => {
        const isMeA = user && a.userId === user.id;
        const isMeB = user && b.userId === user.id;
        if (isMeA) return -1;
        if (isMeB) return 1;

        const isSocialA = !!a.userId;
        const isSocialB = !!b.userId;
        if (isSocialA && !isSocialB) return -1;
        if (!isSocialA && isSocialB) return 1;

        return 0;
    });

    const maxDisplay = 5;
    const showMore = totalCount > maxDisplay;
    const displayCount = showMore ? 3 : maxDisplay;
    const displayParticipants = sortedParticipants.slice(0, displayCount);
    const extraCount = totalCount - 3;

    return (
        <div
            className="flex items-center -space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={clickHandler}
        >
            {displayParticipants.map((p, i) => (
                <div key={i} className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-white" title={p.name}>
                    {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] text-gray-600 font-medium">{p.name[0]}</span>
                    )}
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
