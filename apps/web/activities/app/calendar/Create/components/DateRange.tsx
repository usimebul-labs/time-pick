"use client";

import { Card, CardContent, Input, Label, Checkbox, Button } from "@repo/ui";
import { CreateCalendarData } from "../hooks/types";
import { CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { useDateRange } from "../hooks/useDateRange";
import CreateLayout from "./CreateLayout";

export default function CreateDateRange() {
    const {
        data,
        updateData,
        isUndefined,
        handleUndefinedChange,
        handleNext,
    } = useDateRange();

    return (
        <CreateLayout title="일정 만들기" step={3} totalSteps={5}>
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-bold text-slate-900">언제 만날까요?</Label>
                    <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors hover:border-slate-300">
                        <span className="text-xs font-semibold text-slate-600">
                            아직 잘 모르겠어요
                        </span>
                        <Checkbox
                            id="undefined-range"
                            checked={isUndefined}
                            onCheckedChange={handleUndefinedChange}
                            className="w-4 h-4 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded"
                        />
                    </label>
                </div>

                <div className={isUndefined ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity space-y-8"}>
                    <section>
                        <Label className="text-base font-bold mb-3 flex items-center gap-2 text-slate-900">
                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                            어떤 날짜들이 좋은가요?
                        </Label>
                        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-2 divide-x divide-slate-100">
                                    <div className="p-4">
                                        <Label className="text-xs font-medium text-slate-500 mb-2 block">
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
                                        <Label className="text-xs font-medium text-slate-500 mb-2 block">
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
                            <Label className="text-base font-bold mb-3 flex items-center gap-2 text-slate-900">
                                <Clock className="w-5 h-5 text-purple-500" />
                                몇 시쯤 만날까요?
                            </Label>
                            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                                        <div className="p-4">
                                            <Label className="text-xs font-medium text-slate-500 mb-2 block">
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
                                            <Label className="text-xs font-medium text-slate-500 mb-2 block">
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
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-slate-600">
                            기간 없이 투표를 먼저 시작할 수 있어요.
                        </p>
                    </div>
                )}
            </section>

            <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10 w-full fixed bottom-0 left-0 right-0 max-w-md mx-auto">
                <Button size="xl" className="w-full font-bold shadow-lg rounded-xl" onClick={handleNext}>
                    다음
                    <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                </Button>
            </div>
        </CreateLayout>
    );
}
