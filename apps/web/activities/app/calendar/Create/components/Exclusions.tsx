"use client";

import { Button, Card, CardContent, Input, Label, Checkbox } from "@repo/ui";
import { RotateCcw, Trash2, X, ArrowRight, Calendar } from "lucide-react";
import { useExclusions } from "../hooks/useExclusions";
import CreateLayout from "./CreateLayout";

export default function CreateExclusions() {
    const {
        data,
        DAYS_OF_WEEK,
        toggleDay,
        selectDays,
        excludedDates,
        addExcludedDate,
        removeExcludedDate,
        handleNext,
        toggleHolidays,
    } = useExclusions();

    return (
        <CreateLayout title="일정 만들기" step={4} totalSteps={5}>
            <section className="space-y-8">
                {/* Days of Week */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-bold text-slate-900">어떤 요일에 만날까요?</Label>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => selectDays("all")}
                                className="h-7 text-xs px-2 rounded-full"
                            >
                                매일
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => selectDays("weekday")}
                                className="h-7 text-xs px-2 rounded-full"
                            >
                                평일만
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => selectDays("weekend")}
                                className="h-7 text-xs px-2 rounded-full"
                            >
                                주말만
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">
                        만나기 힘든 요일은 선택을 해제해주세요.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map((day) => {
                            const isSelected = data.enabledDays.includes(day.id);
                            return (
                                <button
                                    key={day.id}
                                    type="button"
                                    onClick={() => toggleDay(day.id)}
                                    className={`
                                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all shadow-sm
                                  ${isSelected
                                            ? "bg-indigo-600 text-white scale-100 font-bold hover:bg-indigo-700"
                                            : "bg-slate-100 text-slate-400 scale-95 hover:bg-slate-200"
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
                <label className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors shadow-sm group">
                    <div>
                        <span className="text-base font-semibold block mb-0.5 text-slate-900 group-hover:text-indigo-900 transition-colors">공휴일은 쉴까요?</span>
                        <p className="text-xs text-slate-500">
                            달력의 빨간 날은 자동으로 제외해요.
                        </p>
                    </div>
                    <Checkbox
                        checked={data.excludeHolidays}
                        onCheckedChange={(checked) => toggleHolidays(checked === true)}
                        className="w-5 h-5 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded"
                    />
                </label>

                {/* Specific Dates */}
                <div className="space-y-3">
                    <Label className="text-base font-bold block text-slate-900">이 날은 안 돼요 (선택)</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                type="date"
                                min={data.startDate}
                                max={data.endDate}
                                className="w-full bg-white border-slate-200 rounded-xl"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addExcludedDate(e.target.value);
                                        e.target.value = ""; // Reset input
                                    }
                                }}
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                    <Card className="bg-gray-50 border-none">
                        <CardContent className="p-3">
                            {excludedDates.length === 0 ? (
                                <p className="text-xs text-center text-gray-400 py-2">
                                    제외된 날짜가 없습니다.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {excludedDates.map((date: string) => (
                                        <div
                                            key={date}
                                            className="flex items-center bg-white border border-slate-200 px-2 py-1 rounded-lg text-sm text-slate-700 shadow-sm"
                                        >
                                            <span>{date}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeExcludedDate(date)}
                                                className="ml-2 text-slate-400 hover:text-red-500"
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

            {/* Float Bottom Button */}
            <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10 w-full fixed bottom-0 left-0 right-0 max-w-md mx-auto">
                <Button size="xl" className="w-full font-bold shadow-lg rounded-xl" onClick={handleNext}>
                    다음
                    <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                </Button>
            </div>
        </CreateLayout>
    );
}
