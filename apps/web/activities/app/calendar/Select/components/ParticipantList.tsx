import { ParticipantDetail, ParticipantSummary } from "@/app/actions/calendar";
import { User } from "lucide-react";
import { useParticipantList } from "../hooks/useParticipantList";
import { EventDetail } from "@/app/actions/calendar";

interface ParticipantListProps {
    event: EventDetail;
    participants: ParticipantSummary[];
    participation: ParticipantDetail | null;
}

export function ParticipantList({
    event,
    participants,
    participation,
}: ParticipantListProps) {
    const {
        selectedParticipantIds,
        onToggleParticipant,
        onSelectHighlighted
    } = useParticipantList(event, participants);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm font-bold text-gray-800">
                    <User className="w-4 h-4 mr-1.5" />
                    <span>참여자 <span className="text-primary">{participants.length}</span>명</span>
                </div>
                {participants.length > 0 && <span className="text-xs text-gray-400">함께하고 있어요</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                {participants.length > 0 ? (
                    participants.map((p) => {
                        const isMe = p.id === participation?.id;
                        const isSelected = selectedParticipantIds.includes(p.id);

                        return (
                            <div
                                key={p.id}
                                onClick={() => onToggleParticipant(p.id)}
                                className={`flex items-center cursor-pointer transition-all duration-200 ${isSelected
                                    ? "bg-primary/5 border border-primary ring-1 ring-primary/20 shadow-sm opacity-100"
                                    : "bg-white border border-gray-200 hover:bg-gray-50"
                                    } rounded-full pl-1 pr-2.5 py-1 select-none hover:scale-105 active:scale-95`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 overflow-hidden ring-1 ring-white transition-colors duration-200 ${isSelected ? "bg-gradient-to-br from-primary/10 to-primary/20 text-primary" : "bg-gray-100 text-gray-500"
                                    }`}>
                                    {p.avatarUrl ? (
                                        <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        p.name[0]
                                    )}
                                </div>
                                <span className={`text-xs font-medium transition-colors duration-200 ${isSelected ? "text-primary font-bold" : "text-gray-700"}`}>
                                    {p.name}
                                    {isMe && <span className={`text-[10px] ml-0.5 ${isSelected ? "text-primary font-bold" : "text-gray-400"}`}>(나)</span>}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center w-full py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        <span className="text-xs text-gray-400">첫 번째 참여자가 되어주세요!</span>
                    </div>
                )}
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
