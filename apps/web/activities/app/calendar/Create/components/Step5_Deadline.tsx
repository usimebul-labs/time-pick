
import { Card, CardContent, Input, Label, Checkbox } from "@repo/ui";
import { CreateCalendarData } from "../types";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface Step5Props {
    data: CreateCalendarData;
    updateData: (updates: Partial<CreateCalendarData>) => void;
}

export default function Step5_Deadline({ data, updateData }: Step5Props) {
    const [isEnabled, setIsEnabled] = useState(!!data.deadline);

    const handleToggle = (checked: boolean) => {
        setIsEnabled(checked);
        if (checked) {
            // Set default deadline if enabling (e.g., EndDate 23:59)
            if (!data.deadline && data.endDate) {
                updateData({ deadline: `${data.endDate}T23:59` });
            }
        } else {
            // Clear deadline
            updateData({ deadline: undefined });
        }
    };

    // Sync local state if data.deadline changes externally (unlikely but good practice)
    useEffect(() => {
        if (data.deadline && !isEnabled) {
            setIsEnabled(true);
        } else if (!data.deadline && isEnabled) {
            // If we want to support "enabled but empty", this logic might be tricky.
            // But here "undefined" means disabled.
        }
    }, [data.deadline]);

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="text-xl font-bold">응답 마감일 설정</Label>
                <div className="flex items-center gap-2">
                    <Label htmlFor="deadline-toggle" className="text-sm text-gray-600">마감일 설정</Label>
                    <Checkbox
                        id="deadline-toggle"
                        checked={isEnabled}
                        onCheckedChange={handleToggle}
                    />
                </div>
            </div>

            <Card className={`border-none shadow-sm transition-opacity ${isEnabled ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                <CardContent className="p-4 bg-gray-50">
                    <Label className="text-base mb-2 flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-primary" />
                        마감 일시
                    </Label>
                    <Input
                        type="datetime-local"
                        value={data.deadline || ""}
                        onChange={(e) => updateData({ deadline: e.target.value })}
                        className="bg-white"
                        disabled={!isEnabled}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        * 마감일이 지나면 새로운 참여자가 일정을 입력할 수 없습니다.
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
