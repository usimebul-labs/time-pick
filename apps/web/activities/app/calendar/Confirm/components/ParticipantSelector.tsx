
import { SharedParticipantList } from "@/components/common/SharedParticipantList";
import { ParticipantSummary } from "@/app/actions/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { cn } from "@repo/ui";

interface ParticipantSelectorProps {
    participants: ParticipantSummary[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    onClear: () => void;
}

export function ParticipantSelector({
    participants,
    selectedIds,
    onToggle,
    onClear
}: ParticipantSelectorProps) {

    const hasSelection = selectedIds.size > 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold px-1 flex items-center gap-2">
                    꼭 참여해야할 멤버가 있나요?
                </h2>
                {hasSelection && (
                    <button
                        onClick={onClear}
                        className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                        선택 해제
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                <SharedParticipantList
                    participants={participants}
                    mode="grid"
                    interaction="selectable"
                    selectedIds={selectedIds}
                    onToggle={onToggle}
                />
            </div>
        </div>
    );
}
