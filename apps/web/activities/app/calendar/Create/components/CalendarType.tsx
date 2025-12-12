"use client";

import { Label, RadioGroup, RadioGroupItem, Button } from "@repo/ui";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { useFlow } from "../../../../../stackflow";
import { useCreateCalendarStore } from "../store";
import CreateLayout from "./CreateLayout";

export default function CreateCalendarType() {
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();

    const handleNext = () => {
        push("CreateDateRange", {});
    };

    return (
        <CreateLayout title="일정 만들기" step={2} totalSteps={5}>
            <section className="space-y-6">
                <h2 className="text-xl font-bold">캘린더 유형을 선택해주세요</h2>

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
                        cursor-pointer border-2 rounded-xl p-4 transition-all hover:bg-gray-50 flex flex-col h-full
                        ${data.scheduleType === "date"
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-gray-200"
                            }
                    `}
                    >
                        <div className="flex flex-col items-center text-center mb-3">
                            <div className="flex justify-between w-full items-start mb-2">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <CalendarDays className="w-5 h-5" />
                                </div>
                                <RadioGroupItem
                                    value="date"
                                    id="type-monthly"
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-bold text-base block mb-1">
                                월간 캘린더
                            </span>
                            <p className="text-gray-500 text-xs leading-tight">
                                날짜 위주 / 하루 단위 투표
                            </p>
                        </div>

                        {/* Visual Mockup - Monthly */}
                        <div className="bg-white border rounded p-1.5 grid grid-cols-7 gap-0.5 text-center pointer-events-none opacity-80 mt-auto">
                            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                                <div key={d} className="text-[8px] text-gray-400">
                                    {d}
                                </div>
                            ))}
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2.5 rounded-[1px] ${[4, 5, 8, 10].includes(i) ? "bg-blue-200" : "bg-gray-100"
                                        }`}
                                />
                            ))}
                        </div>
                    </Label>

                    {/* Weekly (Date + Time) */}
                    <Label
                        htmlFor="type-weekly"
                        className={`
                        cursor-pointer border-2 rounded-xl p-4 transition-all hover:bg-gray-50 flex flex-col h-full
                        ${data.scheduleType === "datetime"
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-gray-200"
                            }
                    `}
                    >
                        <div className="flex flex-col items-center text-center mb-3">
                            <div className="flex justify-between w-full items-start mb-2">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <RadioGroupItem
                                    value="datetime"
                                    id="type-weekly"
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-bold text-base block mb-1">
                                주간 캘린더
                            </span>
                            <p className="text-gray-500 text-xs leading-tight">
                                시간 위주 / 시간 단위 조율
                            </p>
                        </div>

                        {/* Visual Mockup - Weekly */}
                        <div className="bg-white border rounded p-1.5 flex justify-between gap-0.5 pointer-events-none opacity-80 h-[58px] overflow-hidden mt-auto">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex-1 flex flex-col gap-0.5">
                                    <div className="h-1.5 bg-gray-100 rounded-[1px] mb-0.5" />
                                    <div
                                        className={`flex-1 rounded-[1px] ${i % 2 === 0
                                            ? "bg-purple-100 mt-1 mb-2"
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
