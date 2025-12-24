import { SharedParticipantList } from "@/common/components/SharedParticipantList";
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
        <SharedParticipantList
            participants={participants.map(p => ({ ...p, id: p.userId || p.name }))}
            mode="facepile"
            maxFacepile={5}
            currentUser={user}
            onFacepileClick={() => clickHandler({} as any)}
            className="-space-x-2"
            itemClassName="w-6 h-6 ring-1 focus:ring-1"
        />
    );
}
