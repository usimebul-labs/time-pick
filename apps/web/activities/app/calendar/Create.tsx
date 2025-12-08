"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useActionState, useEffect, useState } from "react";
import { useFlow } from "../../../stackflow";

import { createCalendar, CreateCalendarState } from "@/app/actions/calendar";
import {
    Button,
    Card,
    CardContent,
    Input,
    Label,
    RadioGroup,
    RadioGroupItem,
    Textarea,
} from "@repo/ui";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

type CreateProps = {};

const initialState: CreateCalendarState = { message: "", error: "" };

export default function Create({ }: CreateProps) {
    const { pop, replace } = useFlow();
    const [state, formAction] = useActionState(createCalendar, initialState);

    useEffect(() => {
        if (state.message === "Success" && state.eventId) {
            alert("캘린더가 생성되었습니다!");
            replace("Join", { id: state.eventId });
        } else if (state.error) {
            alert(state.error);
        }
    }, [state, pop, replace]);

    // Helper date functions
    const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getTodayStr = () => {
        return formatDate(new Date());
    };

    const getLastDayOfMonthStr = () => {
        const d = new Date();
        return formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
    };

    // State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [scheduleType, setScheduleType] = useState<"date" | "datetime">("date");

    // Date Range (String format YYYY-MM-DD for native input)
    const [startDate, setStartDate] = useState(getTodayStr());
    const [endDate, setEndDate] = useState(getLastDayOfMonthStr());

    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(18);

    const [enabledDays, setEnabledDays] = useState<string[]>([
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    ]);

    // Deadline (YYYY-MM-DDTHH:mm)
    const [deadline, setDeadline] = useState(`${getLastDayOfMonthStr()}T23:59`);

    const days = [
        { id: "Sun", label: "일", isWeekend: true },
        { id: "Mon", label: "월", isWeekend: false },
        { id: "Tue", label: "화", isWeekend: false },
        { id: "Wed", label: "수", isWeekend: false },
        { id: "Thu", label: "목", isWeekend: false },
        { id: "Fri", label: "금", isWeekend: false },
        { id: "Sat", label: "토", isWeekend: true },
    ];

    const toggleDay = (dayId: string) => {
        setEnabledDays((prev) =>
            prev.includes(dayId)
                ? prev.filter((d) => d !== dayId)
                : [...prev, dayId]
        );
    };

    const selectDays = (type: "all" | "weekday" | "weekend") => {
        if (type === "all") {
            setEnabledDays(days.map((d) => d.id));
        } else if (type === "weekday") {
            setEnabledDays(days.filter((d) => !d.isWeekend).map((d) => d.id));
        } else if (type === "weekend") {
            setEnabledDays(days.filter((d) => d.isWeekend).map((d) => d.id));
        }
    };

    const handleEndDateChange = (newEndDate: string) => {
        setEndDate(newEndDate);

        if (!newEndDate) return;

        // Smart Deadline Logic
        if (!deadline) {
            setDeadline(`${newEndDate}T23:59`);
            return;
        }

        const endTimestamp = new Date(`${newEndDate}T23:59:59`).getTime();
        const deadlineTimestamp = new Date(deadline).getTime();

        if (endTimestamp > deadlineTimestamp) {
            setDeadline(`${newEndDate}T23:59`);
        }
    };

    return (
        <AppScreen
            appBar={{
                title: "캘린더 생성하기",
                backButton: {
                    onClick: () => pop(),
                },
            }}
        >
            <form action={formAction} className="flex flex-col h-full bg-gray-50">
                {/* Hidden Inputs for state values */}
                <input type="hidden" name="scheduleType" value={scheduleType} />
                <input type="hidden" name="enabledDays" value={JSON.stringify(enabledDays)} />

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <div>
                            <Label className="text-base mb-1.5 block">일정 제목</Label>
                            <Input
                                name="title"
                                placeholder="예: 팀 주간 회의, 점심 약속"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white"
                                required
                            />
                        </div>
                        <div>
                            <Label className="text-base mb-1.5 block">설명 (선택)</Label>
                            <Textarea
                                name="description"
                                placeholder="일정에 대한 간단한 설명을 적어주세요."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white resize-none"
                            />
                        </div>
                    </section>

                    {/* Schedule Type */}
                    <section>
                        <Label className="text-base mb-2 block">일정 유형</Label>
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-4">
                                <RadioGroup
                                    value={scheduleType}
                                    onValueChange={(val) => setScheduleType(val as "date" | "datetime")}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="monthly" id="r-monthly" />
                                        <Label htmlFor="r-monthly" className="font-normal cursor-pointer">날짜만</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="weekly" id="r-weekly" />
                                        <Label htmlFor="r-weekly" className="font-normal cursor-pointer">주간</Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Date Range */}
                    <section>
                        <Label className="text-base mb-2 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            날짜 범위
                        </Label>
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1 block">
                                        시작일
                                    </Label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1 block">
                                        종료일
                                    </Label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        value={endDate}
                                        onChange={(e) => handleEndDateChange(e.target.value)}
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Time Range */}
                    {scheduleType === 'datetime' && (
                        <section>
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-base flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    시간 범위
                                </Label>
                            </div>

                            <Card className="border-none shadow-sm">
                                <CardContent className="p-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">
                                            시작 시간 (시)
                                        </Label>
                                        <Input
                                            type="number"
                                            name="startHour"
                                            min={0}
                                            max={23}
                                            value={startHour}
                                            onChange={(e) => setStartHour(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">
                                            종료 시간 (시)
                                        </Label>
                                        <Input
                                            type="number"
                                            name="endHour"
                                            min={0}
                                            max={23}
                                            value={endHour}
                                            onChange={(e) => setEndHour(Number(e.target.value))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    )}

                    {/* Available Days */}
                    <section>
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-base block">가능 요일</Label>
                            <div className="flex gap-1 text-xs">
                                <button type="button" onClick={() => selectDays("all")} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">전체</button>
                                <button type="button" onClick={() => selectDays("weekday")} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">평일</button>
                                <button type="button" onClick={() => selectDays("weekend")} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">주말</button>
                            </div>
                        </div>
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {days.map((day) => {
                                        const isSelected = enabledDays.includes(day.id);
                                        return (
                                            <button
                                                key={day.id}
                                                type="button"
                                                onClick={() => toggleDay(day.id)}
                                                className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
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

                    {/* Deadline */}
                    <section>
                        <Label className="text-base mb-2 block">응답 마감일</Label>
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-4">
                                <Input
                                    type="datetime-local"
                                    name="deadline"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    * 기본값은 종료일 23:59입니다.
                                </p>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                <div className="p-4 bg-white border-t safe-area-bottom">
                    <Button
                        type="submit"
                        className="w-full text-lg h-12"
                        disabled={!title || !startDate || !endDate}
                    >
                        일정 생성하기
                    </Button>
                </div>
            </form>
        </AppScreen>
    );
}
