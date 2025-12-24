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
    return (
        <SharedParticipantList
            participants={participants.map(p => ({ ...p, id: p.userId || p.name }))}
            mode="facepile"
            maxFacepile={4}
            overflowIndicator="icon"
            currentUser={user}
            onFacepileClick={clickHandler}
            className="-space-x-2"
            itemClassName="w-6 h-6 ring-1 focus:ring-1"
        />
    );
}
