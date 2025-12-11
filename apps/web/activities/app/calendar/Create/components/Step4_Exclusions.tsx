
import { Button, Card, CardContent, Input, Label, Checkbox } from "@repo/ui";
import { CreateCalendarData } from "../types";
import { RotateCcw, Trash2, X } from "lucide-react";

interface Step4Props {
    data: CreateCalendarData;
    updateData: (updates: Partial<CreateCalendarData>) => void;
}

const DAYS_OF_WEEK = [
    { id: "Sun", label: "일", isWeekend: true },
    { id: "Mon", label: "월", isWeekend: false },
    { id: "Tue", label: "화", isWeekend: false },
    { id: "Wed", label: "수", isWeekend: false },
    { id: "Thu", label: "목", isWeekend: false },
    { id: "Fri", label: "금", isWeekend: false },
    { id: "Sat", label: "토", isWeekend: true },
];

export default function Step4_Exclusions({ data, updateData }: Step4Props) {
    const toggleDay = (dayId: string) => {
        const current = data.enabledDays;
        const next = current.includes(dayId)
            ? current.filter((d) => d !== dayId)
            : [...current, dayId];
        updateData({ enabledDays: next });
    };

    const selectDays = (type: "all" | "weekday" | "weekend") => {
        if (type === "all") {
            const allDays = DAYS_OF_WEEK.map((d) => d.id);
            updateData({ enabledDays: allDays });
        } else if (type === "weekday") {
            const weekdays = DAYS_OF_WEEK.filter((d) => !d.isWeekend).map((d) => d.id);
            updateData({ enabledDays: weekdays });
        } else if (type === "weekend") {
            const weekends = DAYS_OF_WEEK.filter((d) => d.isWeekend).map((d) => d.id);
            updateData({ enabledDays: weekends });
        }
    };

    // Specific Date Exclusions
    const excludedDates = data.excludedDates || [];

    const addExcludedDate = (dateStr: string) => {
        if (!dateStr) return;
        if (excludedDates.includes(dateStr)) return;
        updateData({ excludedDates: [...excludedDates, dateStr] });
    };

    const removeExcludedDate = (dateStr: string) => {
        updateData({ excludedDates: excludedDates.filter((d: string) => d !== dateStr) });
    };

    return (
        <section className="space-y-8">
            {/* Days of Week */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">요일 설정</Label>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => selectDays("all")} className="h-7 text-xs px-2">전체</Button>
                        <Button variant="outline" size="sm" onClick={() => selectDays("weekday")} className="h-7 text-xs px-2">평일</Button>
                        <Button variant="outline" size="sm" onClick={() => selectDays("weekend")} className="h-7 text-xs px-2">주말</Button>
                    </div>
                </div>
                <p className="text-sm text-gray-500">제외하고 싶은 요일을 선택 해제하세요.</p>
                <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                        const isSelected = data.enabledDays.includes(day.id);
                        return (
                            <button
                                key={day.id}
                                type="button"
                                onClick={() => toggleDay(day.id)}
                                className={`
                                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                  ${isSelected
                                        ? "bg-primary text-primary-foreground shadow-md scale-100"
                                        : "bg-gray-100 text-gray-300 scale-90"
                                    }
                                `}
                            >
                                {day.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Holidays */}
            <div className="flex items-center justify-between py-2">
                <div>
                    <Label className="text-lg font-bold block">공휴일 제외</Label>
                    <p className="text-xs text-gray-500 mt-1">달력에 표시된 공휴일을 자동으로 제외합니다.</p>
                </div>
                <Checkbox
                    disabled // Not implemented yet logic-wise
                />
            </div>

            {/* Specific Dates */}
            <div className="space-y-3">
                <Label className="text-lg font-bold block">날짜 지정 제외</Label>
                <div className="flex gap-2">
                    <Input
                        type="date"
                        className="flex-1 bg-white"
                        onChange={(e) => {
                            if (e.target.value) {
                                addExcludedDate(e.target.value);
                                e.target.value = ''; // Reset input
                            }
                        }}
                    />
                </div>
                <Card className="bg-gray-50 border-none">
                    <CardContent className="p-3">
                        {excludedDates.length === 0 ? (
                            <p className="text-xs text-center text-gray-400 py-2">제외된 날짜가 없습니다.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {excludedDates.map((date: string) => (
                                    <div key={date} className="flex items-center bg-white border px-2 py-1 rounded text-sm text-gray-700 shadow-sm">
                                        <span>{date}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeExcludedDate(date)}
                                            className="ml-2 text-gray-400 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
