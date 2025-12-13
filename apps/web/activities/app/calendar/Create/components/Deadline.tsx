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
    const [isUnlimited, setIsUnlimited] = useState(!data.deadline);
    const [state, formAction] = useActionState(createCalendar, initialState);
    const [showShareDialog, setShowShareDialog] = useState(false);

    const handleToggle = (checked: boolean) => {
        setIsUnlimited(checked);
        if (checked) {
            updateData({ deadline: undefined });
        } else {
            if (!data.deadline && data.endDate) {
                updateData({ deadline: `${data.endDate}T23:59` });
            } else if (!data.deadline) {
                // Default to tomorrow if no end date
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                updateData({ deadline: tomorrow.toISOString().slice(0, 16) });
            }
        }
    };

    useEffect(() => {
        if (data.deadline && isUnlimited) {
            setIsUnlimited(false);
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
            <section className="space-y-2">
                <div className="flex">
                    <div className="flex items-center gap-2 ml-auto">
                        <Label htmlFor="deadline-toggle" className="text-xs text-gray-500 cursor-pointer">
                            마감 시간은 정하지 않을래요
                        </Label>
                        <Checkbox
                            id="deadline-toggle"
                            checked={isUnlimited}
                            onCheckedChange={handleToggle}
                            className="w-5 h-5"
                        />
                    </div>
                </div>

                <Card
                    className={`border-none shadow-sm transition-all duration-300 ${!isUnlimited ? "opacity-100 translate-y-0" : "opacity-30 pointer-events-none translate-y-2"
                        }`}
                >
                    <CardContent className="p-4 bg-gray-50 rounded-xl">
                        <Label className="text-base font-bold mb-2 flex items-center gap-2 text-gray-800">
                            <Clock className="w-4 h-4 text-primary" />
                            이 때까지 투표 받을게요
                        </Label>
                        <Input
                            type="datetime-local"
                            value={data.deadline || ""}
                            onChange={(e) => updateData({ deadline: e.target.value })}
                            className="bg-white border-gray-200"
                            disabled={isUnlimited}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            마감 시간이 지나면 친구들이 더 이상 투표할 수 없어요.
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
                        캘린더 만들고 초대하기
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
