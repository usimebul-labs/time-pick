"use client";

import { Card, CardContent, Input, Label, Checkbox, Button } from "@repo/ui";
import { Clock, Check } from "lucide-react";
import { useRef } from "react";
import { useDeadline } from "../hooks/useDeadline";
import CreateLayout from "./CreateLayout";

export default function CreateDeadline() {
    const { data, updateData, isUnlimited, handleToggle, handleSubmit, isPending } = useDeadline();
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <CreateLayout title="일정 만들기" step={5} totalSteps={5}>
            <section className="space-y-2">
                <div className="flex justify-end mb-4">
                    <label htmlFor="deadline-toggle" className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors hover:border-slate-300 shadow-sm">
                        <span className="text-xs font-semibold text-slate-600">
                            마감 시간은 정하지 않을래요
                        </span>
                        <Checkbox
                            id="deadline-toggle"
                            checked={isUnlimited}
                            onCheckedChange={handleToggle}
                            className="w-4 h-4 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded"
                        />
                    </label>
                </div>

                <Card
                    className={`border-none shadow-sm transition-all duration-300 ${!isUnlimited ? "opacity-100 translate-y-0" : "opacity-30 pointer-events-none translate-y-2"
                        }`}
                >
                    <CardContent className="p-4 bg-slate-50 rounded-xl">
                        <Label className="text-base font-bold mb-2 flex items-center gap-2 text-slate-800">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            이 때까지 투표 받을게요
                        </Label>
                        <Input
                            type="datetime-local"
                            value={data.deadline || ""}
                            min={new Date().toISOString().slice(0, 16)}
                            max={`${data.endDate}T23:59`}
                            onChange={(e) => updateData({ deadline: e.target.value })}
                            className="bg-white border-slate-200 rounded-xl"
                            disabled={isUnlimited}
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            마감 시간이 지나면 친구들이 더 이상 투표할 수 없어요.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* float bottom button */}
            <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10 w-full fixed bottom-0 left-0 right-0 max-w-md mx-auto">
                <form
                    ref={formRef}
                    className="w-full">
                    {/* Hidden inputs to pass data to Server Action */}
                    <input type="hidden" name="title" value={data.title} />
                    <input type="hidden" name="description" value={data.description} />
                    <input type="hidden" name="scheduleType" value={data.scheduleType} />
                    <input type="hidden" name="startDate" value={data.startDate} />
                    <input type="hidden" name="endDate" value={data.endDate} />
                    <input type="hidden" name="startHour" value={data.startHour} />
                    <input type="hidden" name="endHour" value={data.endHour} />
                    <input
                        type="hidden"
                        name="enabledDays"
                        value={JSON.stringify(data.enabledDays)}
                    />
                    <input
                        type="hidden"
                        name="excludedDates"
                        value={JSON.stringify(data.excludedDates)}
                    />
                    <input
                        type="hidden"
                        name="excludeHolidays"
                        value={String(data.excludeHolidays)}
                    />
                    {data.deadline && (
                        <input type="hidden" name="deadline" value={data.deadline} />
                    )}

                    <Button
                        size="xl"
                        type="button"
                        onClick={() => {
                            if (formRef.current) {
                                handleSubmit(new FormData(formRef.current));
                            }
                        }}
                        disabled={isPending}
                        className="w-full font-bold shadow-lg rounded-xl">
                        {isPending ? "생성 중..." : "캘린더 만들고 초대하기"}
                    </Button>
                </form>
            </div>
        </CreateLayout>
    );
}
