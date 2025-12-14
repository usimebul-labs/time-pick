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

            <div className="flex flex-wrap gap-2">
                {(selectedSlot ? selectedSlot.availableParticipants : participants).length > 0 ? (
                    (selectedSlot ? selectedSlot.availableParticipants : participants).map((p) => {
                        const isSelected = selectedVipIds.has(p.id);
                        return (
                            <button
                                key={p.id}
                                onClick={() => onVipToggle(p.id)}
                                className={`flex items-center rounded-full px-2 py-1 border transition-all ${isSelected
                                    ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                                    : "bg-gray-50 border-transparent hover:bg-gray-100"
                                    }`}
                            >
                                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-600 mr-1.5 overflow-hidden">
                                    {p.avatarUrl ? (
                                        <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        p.name[0]
                                    )}
                                </div>
                                <span className={`text-xs ${isSelected ? "text-indigo-700 font-semibold" : "text-gray-700"}`}>
                                    {p.name}
                                </span>
                            </button>
                        );
                    })
                ) : (
                    <div className="w-full text-center py-8 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-2xl">👀</span>
                        <span className="text-sm text-gray-400 font-medium">
                            {selectedSlot ? "이 시간에는 가능한 친구가 없어요 ㅠㅠ" : "아직 참여한 친구가 없어요."}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
