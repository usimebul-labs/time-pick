import { Card, CardContent, Input, Label } from "@repo/ui";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { ModifyFormState } from "../hooks/types";

interface DateRangeSectionProps {
    data: ModifyFormState;
    onChange: (updates: Partial<ModifyFormState>) => void;
}

export function DateRangeSection({ data, onChange }: DateRangeSectionProps) {
    const handleEndDateChange = (newEndDate: string) => {
        const updates: Partial<ModifyFormState> = { endDate: newEndDate };

        // Auto-adjust deadline if it exceeds the new end date
        if (newEndDate) {
            if (!data.deadline) {
                updates.deadline = `${newEndDate}T23:59`;
            } else {
                const endTimestamp = new Date(`${newEndDate}T23:59:59`).getTime();
                const deadlineTimestamp = new Date(data.deadline).getTime();
                if (endTimestamp > deadlineTimestamp) {
                    updates.deadline = `${newEndDate}T23:59`;
                }
            }
        }
        onChange(updates);
    };

    return (
        <div className="space-y-6">
            <section>
                <Label className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    날짜 범위
                </Label>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-gray-500 mb-1 block">시작일</Label>
                            <Input
                                type="date"
                                value={data.startDate}
                                onChange={(e) => onChange({ startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 mb-1 block">종료일</Label>
                            <Input
                                type="date"
                                value={data.endDate}
                                onChange={(e) => handleEndDateChange(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {data.scheduleType === 'datetime' && (
                <section>
                    <Label className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        시간 범위
                    </Label>
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-4 grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-gray-500 mb-1 block">시작 시간 (시)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={23}
                                    value={data.startHour}
                                    onChange={(e) => onChange({ startHour: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500 mb-1 block">종료 시간 (시)</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={23}
                                    value={data.endHour}
                                    onChange={(e) => onChange({ endHour: Number(e.target.value) })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
}
