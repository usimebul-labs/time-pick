
import { Card, CardContent, Input, Label, Checkbox } from "@repo/ui";
import { CreateCalendarData } from "../types";
import { CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

interface Step3Props {
    data: CreateCalendarData;
    updateData: (updates: Partial<CreateCalendarData>) => void;
}

export default function Step3_DateRange({ data, updateData }: Step3Props) {
    const [isUndefined, setIsUndefined] = useState(false);

    const handleUndefinedChange = (checked: boolean) => {
        setIsUndefined(checked);
        if (checked) {
            // Optional: Set specific flag or just disable inputs visually
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="text-xl font-bold">일정 기간 설정</Label>
                <div className="flex items-center gap-2">
                    <Label htmlFor="undefined-range" className="text-sm text-gray-600">기간 미설정</Label>
                    <Checkbox
                        id="undefined-range"
                        checked={isUndefined}
                        onCheckedChange={handleUndefinedChange}
                    />
                </div>
            </div>

            <div className={isUndefined ? "opacity-50 pointer-events-none" : ""}>
                <section className="mb-6">
                    <Label className="text-base mb-2 flex items-center gap-2 text-gray-700">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        날짜 범위
                    </Label>
                    <Card className="border-none shadow-sm bg-gray-50">
                        <CardContent className="p-4 grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-gray-500 mb-1 block">시작일</Label>
                                <Input
                                    type="date"
                                    value={data.startDate}
                                    onChange={(e) => updateData({ startDate: e.target.value })}
                                    className="bg-white"
                                    required={!isUndefined}
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500 mb-1 block">종료일</Label>
                                <Input
                                    type="date"
                                    value={data.endDate}
                                    onChange={(e) => updateData({ endDate: e.target.value })}
                                    className="bg-white"
                                    required={!isUndefined}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {data.scheduleType === 'datetime' && (
                    <section>
                        <Label className="text-base mb-2 flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4" />
                            시간 범위
                        </Label>
                        <Card className="border-none shadow-sm bg-gray-50">
                            <CardContent className="p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1 block">시작 시간 (시)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={23}
                                        value={data.startHour ?? 9}
                                        onChange={(e) => updateData({ startHour: Number(e.target.value) })}
                                        className="bg-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1 block">종료 시간 (시)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={23}
                                        value={data.endHour ?? 18}
                                        onChange={(e) => updateData({ endHour: Number(e.target.value) })}
                                        className="bg-white"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}
            </div>
            {isUndefined && (
                <p className="text-sm text-gray-500 text-center">
                    기간을 설정하지 않으면 기본 기간으로 생성됩니다.
                </p>
            )}
        </section>
    );
}
