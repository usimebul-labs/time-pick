"use client";

import { Card, CardContent, Input, Label, Checkbox, Button, ShareCalendarDialog } from "@repo/ui";
import { Clock, Check } from "lucide-react";
import { useState, useEffect, useActionState } from "react";
import { useFlow } from "../../../../../stackflow";
import { useCreateCalendarStore } from "../store";
import CreateLayout from "./CreateLayout";
import { createCalendar, CreateCalendarState } from "@/app/actions/calendar";

const initialState: CreateCalendarState = { message: "", error: "" };

export default function CreateDeadline() {
    const { replace } = useFlow();
    const { data, updateData } = useCreateCalendarStore();
    const [isEnabled, setIsEnabled] = useState(!!data.deadline);
    const [state, formAction] = useActionState(createCalendar, initialState);
    const [showShareDialog, setShowShareDialog] = useState(false);

    const handleToggle = (checked: boolean) => {
        setIsEnabled(checked);
        if (checked) {
            if (!data.deadline && data.endDate) {
                updateData({ deadline: `${data.endDate}T23:59` });
            }
        } else {
            updateData({ deadline: undefined });
        }
    };

    useEffect(() => {
        if (data.deadline && !isEnabled) {
            setIsEnabled(true);
        }
    }, [data.deadline]);

    // Handle Submission Result
    useEffect(() => {
        if (state.message === "Success" && state.eventId) {
            setShowShareDialog(true);
        } else if (state.error) {
            alert(state.error);
        }
    }, [state]);

    const handleShareClose = () => {
        setShowShareDialog(false);
        if (state.eventId) {
            replace("Join", { id: state.eventId }, { animate: false });
        }
    };

    return (
        <CreateLayout title="일정 만들기" step={5} totalSteps={5}>
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-xl font-bold">응답 마감일 설정</Label>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="deadline-toggle" className="text-sm text-gray-600">
                            마감일 설정
                        </Label>
                        <Checkbox
                            id="deadline-toggle"
                            checked={isEnabled}
                            onCheckedChange={handleToggle}
                        />
                    </div>
                </div>

                <Card
                    className={`border-none shadow-sm transition-opacity ${isEnabled ? "opacity-100" : "opacity-30 pointer-events-none"
                        }`}
                >
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

            {/* Float Bottom Button */}
            <div className="p-4 bg-white border-t safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 w-full fixed bottom-0 left-0 right-0 max-w-md mx-auto">
                <form action={formAction} className="w-full">
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
                    {data.deadline && (
                        <input type="hidden" name="deadline" value={data.deadline} />
                    )}

                    <Button size="lg" type="submit" className="w-full text-base">
                        <Check className="w-4 h-4 mr-2" />
                        캘린더 만들기
                    </Button>
                </form>
            </div>

            <ShareCalendarDialog
                isOpen={showShareDialog}
                onClose={handleShareClose}
                link={
                    typeof window !== "undefined"
                        ? `${window.location.origin}/app/calendar/${state.eventId}`
                        : ""
                }
            />
        </CreateLayout>
    );
}
