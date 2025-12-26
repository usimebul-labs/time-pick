import { ParticipantGrid } from "@/common/components/participant/ParticipantGrid";
import { Users } from "lucide-react";
import { ParticipantSummary } from "@/app/actions/calendar";
import { SelectedSlot } from "../useStatus";

interface ParticipantListProps {
    participants: ParticipantSummary[];
    selectedSlot: SelectedSlot | null;
    selectedVipIds: Set<string>;
    onSlotClear: () => void;
    onVipToggle: (id: string) => void;
}

export function ParticipantList({
    participants,
    selectedSlot,
    selectedVipIds,
    onSlotClear,
    onVipToggle
}: ParticipantListProps) {
    return (
        <div className="p-5 pb-32">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900">
                        {selectedSlot ? `${selectedSlot.time}에` : "함께하는 사람들"}
                    </span>
                    <span className={`text-base font-bold ${selectedSlot ? "text-primary" : "text-gray-500"}`}>
                        {selectedSlot ? selectedSlot.count : participants.length}명
                    </span>
                </h2>
                {selectedSlot ? (
                    <button
                        onClick={onSlotClear}
                        className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
                    >
                        전체 친구 보기
                    </button>
                ) : (
                    <span className="text-xs text-gray-400">친구를 눌러보세요!</span>
                )}
            </div>

            <ParticipantGrid
                participants={selectedSlot ? selectedSlot.availableParticipants : participants}
                interaction="selectable"
                selectedIds={selectedVipIds}
                onToggle={onVipToggle}
            />
        </div>
    );
}
