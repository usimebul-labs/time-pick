
import { ParticipantGrid } from "@/common/components/participant/ParticipantGrid";
import { ParticipantSummary } from "@/app/actions/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { cn } from "@repo/ui";

import { useConfirmStore } from "../stores/useConfirmStore";

interface ParticipantSelectorProps {
    participants: ParticipantSummary[];
    highlightedIds?: string[];
}

export function ParticipantSelector({
    participants,
    highlightedIds,
}: ParticipantSelectorProps) {
    const { selectedParticipantIds, toggleParticipant, clearParticipants } = useConfirmStore();
    const hasSelection = selectedParticipantIds.size > 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold px-1 flex items-center gap-2">
                    꼭 참여해야할 멤버가 있나요?
                </h2>
                {hasSelection && (
                    <button
                        onClick={clearParticipants}
                        className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                        선택 해제
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                <ParticipantGrid
                    participants={participants}
                    interaction="selectable"
                    selectedIds={selectedParticipantIds}
                    highlightedIds={highlightedIds}
                    onToggle={toggleParticipant}
                />
            </div>
        </div>
    );
}
