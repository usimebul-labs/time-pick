"use client";

import { Card, CardContent, Input, Label, Checkbox, Button } from "@repo/ui";
import { CreateCalendarData } from "../types";
import { CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useFlow } from "../../../../../stackflow";
import { useCreateCalendarStore } from "../store";
import CreateLayout from "./CreateLayout";

export default function CreateDateRange() {
    const { push } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isUndefined, setIsUndefined] = useState(false);

    const handleUndefinedChange = (checked: boolean) => {
        setIsUndefined(checked);
        if (checked) {
            // Optional: Set specific flag or just disable inputs visually
        }
    };

    const handleNext = () => {
        if (!isUndefined && (!data.startDate || !data.endDate)) {
            alert("시작일과 종료일을 설정해주세요.");
            return;
        }
        push("CreateExclusions", {});
    };

    return (
        <CreateLayout title="일정 만들기" step={3} totalSteps={5}>
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">언제 만날까요?</Label>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="undefined-range" className="text-xs text-gray-500 cursor-pointer">
                            아직 잘 모르겠어요
                        </Label>
                        <Checkbox
                            id="undefined-range"
                            checked={isUndefined}
                            onCheckedChange={handleUndefinedChange}
                            className="w-5 h-5"
                        />
                    </div>
                </div>

                <div className={isUndefined ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity space-y-8"}>
                    <section>
                        <Label className="text-base font-bold mb-3 flex items-center gap-2 text-gray-800">
                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                            어떤 날짜들이 좋은가요?
                        </Label>
                        <Card className="border shadow-sm bg-white overflow-hidden rounded-xl">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-2 divide-x divide-gray-100">
                                    <div className="p-4">
                                        <Label className="text-xs font-medium text-gray-500 mb-2 block">
                                            이날부터
                                        </Label>
                                        <Input
                                            type="date"
                                            value={data.startDate}
                                            onChange={(e) => updateData({ startDate: e.target.value })}
                                            className="bg-transparent border-none shadow-none p-0 h-auto text-base focus-visible:ring-0"
                                            required={!isUndefined}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <Label className="text-xs font-medium text-gray-500 mb-2 block">
                                            이날까지
                                        </Label>
                                        <Input
                                            type="date"
                                            value={data.endDate}
                                            onChange={(e) => updateData({ endDate: e.target.value })}
                                            className="bg-transparent border-none shadow-none p-0 h-auto text-base focus-visible:ring-0"
                                            required={!isUndefined}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {data.scheduleType === "datetime" && (
                        <section>
                            <Label className="text-base font-bold mb-3 flex items-center gap-2 text-gray-800">
                                <Clock className="w-5 h-5 text-purple-500" />
                                몇 시쯤 만날까요?
                            </Label>
                            <Card className="border shadow-sm bg-white overflow-hidden rounded-xl">
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-2 divide-x divide-gray-100">
                                        <div className="p-4">
                                            <Label className="text-xs font-medium text-gray-500 mb-2 block">
                                                이 시간부터 (시)
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={23}
                                                value={data.startHour ?? 9}
                                                onChange={(e) =>
                                                    updateData({ startHour: Number(e.target.value) })
                                                }
                                                className="bg-transparent border-none shadow-none p-0 h-auto text-base focus-visible:ring-0"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <Label className="text-xs font-medium text-gray-500 mb-2 block">
                                                이 시간까지 (시)
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={23}
                                                value={data.endHour ?? 18}
                                                onChange={(e) =>
                                                    updateData({ endHour: Number(e.target.value) })
                                                }
                                                className="bg-transparent border-none shadow-none p-0 h-auto text-base focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    )}
                </div>
                {isUndefined && (
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-gray-600">
                            기간 없이 투표를 먼저 시작할 수 있어요.
                        </p>
                    </div>
                )}
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
