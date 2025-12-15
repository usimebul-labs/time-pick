
import { ParticipantSummary } from "@/app/actions/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { cn } from "@repo/ui";

interface ParticipantSelectorProps {
    participants: ParticipantSummary[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    onSelectAll: () => void;
}

export function ParticipantSelector({
    participants,
    selectedIds,
    onToggle,
    onSelectAll
}: ParticipantSelectorProps) {

    const allSelected = participants.length > 0 && selectedIds.size === participants.length;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">
                    함께할 멤버를 선택해주세요
                </span>
                <button
                    onClick={onSelectAll}
                    className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full transition-colors",
                        allSelected
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                >
                    {allSelected ? "전체 선택됨" : "전체 선택"}
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {participants.map(p => {
                    const isSelected = selectedIds.has(p.id);
                    return (
                        <button
                            key={p.id}
                            onClick={() => onToggle(p.id)}
                            className={cn(
                                "flex items-center rounded-full px-3 py-1.5 border transition-all",
                                isSelected
                                    ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                                    : "bg-gray-50 border-transparent hover:bg-gray-100"
                            )}
                        >
                            <Avatar className="h-5 w-5 mr-1.5">
                                <AvatarImage src={undefined} />
                                <AvatarFallback className="text-[10px] bg-gray-300 text-gray-600">
                                    {p.name.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <span className={cn(
                                "text-sm",
                                isSelected ? "text-indigo-700 font-semibold" : "text-gray-700"
                            )}>
                                {p.name}
                            </span>
                        </button>
                    );
                })}
                {participants.length === 0 && (
                    <div className="w-full text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-xl">
                        참여자가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
