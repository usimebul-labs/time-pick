import { ParticipantGrid } from "@/common/components/ParticipantGrid";
import { ParticipantDetail, ParticipantSummary } from "@/app/actions/calendar";
import { User } from "lucide-react";
import { useParticipantList } from "../hooks/useParticipantList";
import { CalendarDetail } from "@/app/actions/calendar";

interface ParticipantListProps {
    calendar: CalendarDetail;
    participants: ParticipantSummary[];
    participation: ParticipantDetail | null;
}

export function ParticipantList({
    calendar,
    participants,
    participation,
}: ParticipantListProps) {
    const {
        selectedParticipantIds,
        onToggleParticipant,
        onSelectHighlighted
    } = useParticipantList(calendar, participants);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm font-bold text-gray-800">
                    <User className="w-4 h-4 mr-1.5" />
                    <span>참여자 <span className="text-primary">{participants.length}</span>명</span>
                </div>
                {participants.length > 0 && <span className="text-xs text-gray-400">함께하고 있어요</span>}
            </div>

            <div className="mb-3">
                <ParticipantGrid
                    participants={participants}
                    interaction="selectable"
                    selectedIds={selectedParticipantIds}
                    onToggle={onToggleParticipant}
                    currentUserId={participation?.id}
                />
            </div>

            {/* Highlighted Selection Button - Bottom Right */}
            <div className="flex justify-end">
                <button
                    onClick={onSelectHighlighted}
                    disabled={selectedParticipantIds.length === 0}
                    className={`text-xs font-bold transition-all duration-200 flex items-center px-3 py-1.5 rounded-lg ${selectedParticipantIds.length > 0
                        ? "bg-primary/10 text-primary hover:bg-primary/15 active:scale-95 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                        }`}
                >
                    <span className="mr-1.5">✨</span>
                    같은 일정으로 선택하기
                </button>
            </div>
        </div>
    );
}
