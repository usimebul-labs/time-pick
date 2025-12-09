"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFlow } from "../../../stackflow";
import { useActivity } from "@stackflow/react";

import { updateEvent, deleteParticipant, getEventWithParticipation, EventDetail, ParticipantSummary } from "@/app/actions/calendar";
import {
    Button,
    Card,
    CardContent,
    Input,
    Label,
    RadioGroup,
    RadioGroupItem,
    Textarea,
    Avatar,
    AvatarImage,
    AvatarFallback,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@repo/ui";
import { Calendar as CalendarIcon, Clock, Trash2, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";



export default function Modify({ params: { id } }: { params: { id: string } }) {
    const { pop } = useFlow();
    const [isPending, startTransition] = useTransition();

    // Data State
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [scheduleType, setScheduleType] = useState<"date" | "datetime">("date");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(18);
    const [enabledDays, setEnabledDays] = useState<string[]>([]);
    const [deadline, setDeadline] = useState("");

    // Conflict Confirmation State
    const [showConflictDialog, setShowConflictDialog] = useState(false);
    const [conflictedParticipants, setConflictedParticipants] = useState<{ id: string; name: string }[]>([]);
    const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

    // Delete Participant Confirmation State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { event, participants, error } = await getEventWithParticipation(id);
            if (error || !event) {
                alert(error || "일정을 불러올 수 없습니다.");
                pop();
                return;
            }

            setEvent(event);
            setParticipants(participants);

            // Initialize Form
            setTitle(event.title);
            setDescription(event.description || "");
            setScheduleType(event.type === 'monthly' ? 'date' : 'datetime'); // Mapping logic
            setStartDate(event.startDate);
            setEndDate(event.endDate);

            if (event.startTime) setStartHour(Number(event.startTime.split(':')[0]));
            if (event.endTime) setEndHour(Number(event.endTime.split(':')[0]));

            // Excluded Days -> Enabled Days
            const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const enabled = allDays.filter((_, idx) => !event.excludedDays.includes(idx));
            setEnabledDays(enabled);

            if (event.deadline) {
                // Format for datetime-local: YYYY-MM-DDTHH:mm
                setDeadline(event.deadline.substring(0, 16));
            }

            setLoading(false);
        };
        init();
    }, [id, pop]);

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

    const handleSubmit = async (formData: FormData) => {
        // Append manual state to formData
        formData.set("enabledDays", JSON.stringify(enabledDays));
        formData.set("scheduleType", scheduleType); // Though server might ignore, good to send

        startTransition(async () => {
            const result = await updateEvent(id, formData, false); // First try without confirm

            if (result.requiresConfirmation && result.conflictedParticipants) {
                setConflictedParticipants(result.conflictedParticipants);
                setPendingFormData(formData);
                setShowConflictDialog(true);
            } else if (result.success) {
                pop();
            } else {
                alert(result.error || "수정 중 오류가 발생했습니다.");
            }
        });
    };

    const handleConfirmConflict = async () => {
        if (!pendingFormData) return;
        setShowConflictDialog(false);

        startTransition(async () => {
            const result = await updateEvent(id, pendingFormData, true); // Confirm delete
            if (result.success) {
                pop();
            } else {
                alert(result.error || "수정 중 오류가 발생했습니다.");
            }
        });
    };

    const handleDeleteParticipantClick = (participantId: string) => {
        setParticipantToDelete(participantId);
        setShowDeleteDialog(true);
    };

    const handleConfirmDeleteParticipant = async () => {
        if (!participantToDelete) return;
        setShowDeleteDialog(false);

        startTransition(async () => {
            const result = await deleteParticipant(participantToDelete);
            if (result.success) {
                setParticipants(prev => prev.filter(p => p.id !== participantToDelete));
            } else {
                alert(result.error || "참여자 삭제 실패");
            }
        });
    };

    if (loading) {
        return (
            <AppScreen>
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AppScreen>
        );
    }

    return (
        <AppScreen
            appBar={{
                title: "일정 수정하기",
                backButton: {
                    onClick: () => pop(),
                },
            }}
        >
            <div className="flex flex-col h-full bg-gray-50">
                <form action={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-8 pb-20">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <div>
                            <Label className="text-base mb-1.5 block">일정 제목</Label>
                            <Input
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white"
                                required
                            />
                        </div>
                        <div>
                            <Label className="text-base mb-1.5 block">설명</Label>
                            <Textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white resize-none"
                            />
                        </div>
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
                                    <Label className="text-xs text-gray-500 mb-1 block">시작일</Label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1 block">종료일</Label>
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

                    {/* Time Range (Conditional) */}
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
                                        <Label className="text-xs text-gray-500 mb-1 block">시작 시간 (시)</Label>
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
                                        <Label className="text-xs text-gray-500 mb-1 block">종료 시간 (시)</Label>
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
                            <Label className="text-base block">제외 요일 설정 (선택된 요일만 가능)</Label>
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
                            </CardContent>
                        </Card>
                    </section>

                    {/* Participants Management */}
                    <section>
                        <Label className="text-base mb-2 block">참여자 관리</Label>
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-0 divide-y">
                                {participants.length > 0 ? (
                                    participants.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={p.avatarUrl || ""} alt={p.name} />
                                                    <AvatarFallback>{p.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{p.name}</span>
                                                    {p.email && <span className="text-xs text-gray-400">{p.email}</span>}
                                                    {p.isGuest && (
                                                        <span className="text-xs text-gray-400">
                                                            {format(parseISO(p.createdAt), "MM.dd HH:mm", { locale: ko })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteParticipantClick(p.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        참여자가 없습니다.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <div className="p-4 bg-white border-t fixed bottom-0 left-0 right-0 safe-area-bottom z-10">
                        <Button
                            type="submit"
                            className="w-full text-lg h-12"
                            disabled={isPending}
                        >
                            {isPending ? "저장 중..." : "수정사항 저장"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Conflict Confirmation Dialog */}
            <AlertDialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
                <AlertDialogContent className="max-w-md w-[90%] rounded-lg">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <AlertDialogTitle className="text-lg">
                                참여자 일정 충돌
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-base text-gray-600">
                            일정을 수정하면 아래 참여자들의 가능한 시간이 범위에서 벗어나게 됩니다.
                        </AlertDialogDescription>

                        <div className="my-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs font-semibold text-red-600 mb-2">
                                삭제될 참여자 ({conflictedParticipants.length}명)
                            </p>
                            <div className="max-h-32 overflow-y-auto pr-2 space-y-1">
                                {conflictedParticipants.map(p => (
                                    <div key={p.id} className="text-sm text-red-800 flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                        {p.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            수정을 진행하면 해당 참여자들의 <strong>참여 이력(가능한 시간)이 초기화</strong>됩니다.<br />
                            계속 진행하시겠습니까?
                        </p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmConflict}
                            className="bg-red-600 hover:bg-red-700 text-white border-0"
                        >
                            초기화하고 수정하기
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Participant Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>참여자 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            정말로 이 참여자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDeleteParticipant} className="bg-red-600 hover:bg-red-700">
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </AppScreen>
    );
}
