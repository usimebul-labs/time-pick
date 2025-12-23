import { Card, CardContent, Label } from "@repo/ui";
import { ModifyFormState, DayOption } from "../types";

interface ExcludedDaysSectionProps {
    data: ModifyFormState;
    onChange: (updates: Partial<ModifyFormState>) => void;
}

const DAYS: DayOption[] = [
    { id: "Sun", label: "일", isWeekend: true },
    { id: "Mon", label: "월", isWeekend: false },
    { id: "Tue", label: "화", isWeekend: false },
    { id: "Wed", label: "수", isWeekend: false },
    { id: "Thu", label: "목", isWeekend: false },
    { id: "Fri", label: "금", isWeekend: false },
    { id: "Sat", label: "토", isWeekend: true },
];

export function ExcludedDaysSection({ data, onChange }: ExcludedDaysSectionProps) {
    const toggleDay = (dayId: string) => {
        const newEnabledDays = data.enabledDays.includes(dayId)
            ? data.enabledDays.filter((d) => d !== dayId)
            : [...data.enabledDays, dayId];
        onChange({ enabledDays: newEnabledDays });
    };

    const selectDays = (type: "all" | "weekday" | "weekend") => {
        let newEnabledDays: string[] = [];
        if (type === "all") {
            newEnabledDays = DAYS.map((d) => d.id);
        } else if (type === "weekday") {
            newEnabledDays = DAYS.filter((d) => !d.isWeekend).map((d) => d.id);
        } else if (type === "weekend") {
            newEnabledDays = DAYS.filter((d) => d.isWeekend).map((d) => d.id);
        }
        onChange({ enabledDays: newEnabledDays });
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-bold text-slate-900 block">가능한 요일 설정</Label>
                <div className="flex gap-1 text-xs">
                    <button type="button" onClick={() => selectDays("all")} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">전체</button>
                    <button type="button" onClick={() => selectDays("weekday")} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">평일</button>
                    <button type="button" onClick={() => selectDays("weekend")} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">주말</button>
                </div>
            </div>
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-nowrap justify-between gap-1">
                        {DAYS.map((day) => {
                            const isSelected = data.enabledDays.includes(day.id);
                            return (
                                <button
                                    key={day.id}
                                    type="button"
                                    onClick={() => toggleDay(day.id)}
                                    className={`
                                        w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-colors flex-shrink-0
                                        ${isSelected
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                        }
                                    `}
                                >
                                    {day.label}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
