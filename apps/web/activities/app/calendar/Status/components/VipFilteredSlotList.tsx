import { ChartDataPoint } from "../useStatus";
import { ParticipantSummary } from "@/app/actions/calendar";
import { ParticipantFacepile } from "@/common/components/participant/ParticipantFacepile";
import { Clock } from "lucide-react";

interface VipFilteredSlotListProps {
    chartData: ChartDataPoint[];
    participants: ParticipantSummary[];
    selectedVipIds: Set<string>;
}

export function VipFilteredSlotList({ chartData, participants, selectedVipIds }: VipFilteredSlotListProps) {
    if (selectedVipIds.size === 0) return null;

    // Filter slots where vipCount matches ALL selected VIPs (AND logic)
    // Assuming vipCount in chartData represents how many VIPs are available in that slot.
    // If selectedVipIds.size is 2, we want slots where vipCount is 2.
    const filteredSlots = chartData.filter(d => d.vipCount === selectedVipIds.size);

    return (
        <div className="p-5">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3 text-slate-900">
                <Clock className="w-5 h-5 text-indigo-600" />
                선택한 친구들이 모두 되는 시간
                <span className="text-indigo-600 ml-1">{filteredSlots.length}개</span>
            </h2>

            <div className="space-y-2">
                {filteredSlots.length > 0 ? (
                    filteredSlots.map(slot => {
                        // Get participants available in this slot
                        const availableParticipants = participants.filter(p =>
                            slot.availableParticipantIds.includes(p.id)
                        ).map(p => ({
                            ...p,
                            id: p.id,
                            userId: p.id, // Adaptation for SharedParticipant type if needed
                        }));

                        return (
                            <div key={slot.time} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <span className="text-sm font-bold text-slate-800">
                                    {slot.time}
                                </span>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-medium">
                                        {slot.count}명
                                    </span>
                                    <ParticipantFacepile
                                        participants={availableParticipants}
                                        maxFacepile={3}
                                        className="-space-x-1"
                                        itemClassName="w-6 h-6 ring-1 ring-white"
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-500">
                            선택한 친구들이 모두 가능한 시간이 없어요 🥲
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
