"use client";

import { Label, RadioGroup, RadioGroupItem, Button } from "@repo/ui";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { useCalendarType } from "../hooks/useCalendarType";
import CreateLayout from "./CreateLayout";

export default function CreateCalendarType() {
    const { data, updateData, handleNext } = useCalendarType();

    return (
        <CreateLayout title="일정 만들기" step={2} totalSteps={5}>
            <section className="space-y-6">
                <h2 className="text-base font-bold">날짜는 어떻게 정할까요?</h2>

                <RadioGroup
                    value={data.scheduleType}
                    onValueChange={(val) =>
                        updateData({ scheduleType: val as "date" | "datetime" })
                    }
                    className="grid grid-cols-2 gap-3"
                >
                    {/* Monthly (Date Only) */}
                    <Label
                        htmlFor="type-monthly"
                        className={`
                        relative cursor-pointer border-2 rounded-xl p-6 transition-all hover:bg-gray-50 flex flex-col items-center text-center h-full
                        ${data.scheduleType === "date"
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-gray-200"
                            }
                    `}
                    >
                        <RadioGroupItem
                            value="date"
                            id="type-monthly"
                            className="sr-only"
                        />

                        <div className="flex flex-col items-center mb-6">
                            {/* 1열: [아이콘] 월간 캘린더 (크게, 볼드) */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <CalendarDays className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                    월간 캘린더
                                </span>
                            </div>

                            {/* 2열: 날짜만 정하기 (작게, 세미볼드) */}
                            <span className="text-xs text-gray-500">
                                날짜만 정하기
                            </span>
                        </div>

                        {/* 3열: 캘린더 예시 - Monthly (4 rows) */}
                        <div className="w-full bg-white border rounded p-2 grid grid-cols-7 gap-1 pointer-events-none opacity-80 mt-auto">
                            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                                <div key={d} className="text-[10px] text-gray-400 mb-1">
                                    {d}
                                </div>
                            ))}
                            {Array.from({ length: 28 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-3 rounded-[2px] ${[4, 5, 8, 10, 15, 20, 22].includes(i) ? "bg-blue-200" : "bg-gray-100"
                                        }`}
                                />
                            ))}
                        </div>
                    </Label>

                    {/* Weekly (Date + Time) */}
                    <Label
                        htmlFor="type-weekly"
                        className={`
                        relative cursor-pointer border-2 rounded-xl p-6 transition-all hover:bg-gray-50 flex flex-col items-center text-center h-full
                        ${data.scheduleType === "datetime"
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-gray-200"
                            }
                    `}
                    >
                        <RadioGroupItem
                            value="datetime"
                            id="type-weekly"
                            className="sr-only"
                        />

                        <div className="flex flex-col items-center mb-6">
                            {/* 1열: [아이콘] 주간 캘린더 (크게, 볼드) */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                    주간 캘린더
                                </span>
                            </div>

                            {/* 2열: 날짜와 시간 정하기 (작게, 세미볼드) */}
                            <span className="text-xs text-gray-500">
                                날짜와 시간 정하기
                            </span>
                        </div>

                        {/* 3열: 캘린더 예시 - Weekly */}
                        <div className="w-full bg-white border rounded p-2 flex justify-between gap-1 pointer-events-none opacity-80 h-full max-h-[105px] mt-auto">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex-1 flex flex-col gap-1">
                                    <div className="h-2 bg-gray-100 rounded-[2px] mb-1" />
                                    <div
                                        className={`flex-1 rounded-[2px] ${i % 2 === 0
                                            ? "bg-purple-100 mt-2 mb-3"
                                            : "bg-gray-50"
                                            }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </Label>
                </RadioGroup>
            </section>

            {/* Float Bottom Button */}
            <div className="p-4 bg-white border-t safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 w-full fixed bottom-0 left-0 right-0 max-w-md mx-auto">
                <Button size="lg" className="w-full text-base" onClick={handleNext}>
                    다음
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </CreateLayout>
    );
}
