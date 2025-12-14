import { startTransition, useEffect, useState } from "react";
import { useFlow } from "@/stackflow";
import { getEventWithParticipation, updateEvent, deleteParticipant, EventDetail, ParticipantSummary } from "@/app/actions/calendar";
import { ModifyFormState, ConflictedParticipant } from "./types";

export function useModify(id: string) {
    const { pop, replace } = useFlow();

    // Data State
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [participants, setParticipants] = useState<ParticipantSummary[]>([]);

    // Form State
    const [formState, setFormState] = useState<ModifyFormState>({
        title: "",
        description: "",
        scheduleType: "date",
        startDate: "",
        endDate: "",
        startHour: 9,
        endHour: 18,
        enabledDays: [],
        deadline: "",
    });

    // Conflict Confirmation State
    const [showConflictDialog, setShowConflictDialog] = useState(false);
    const [conflictedParticipants, setConflictedParticipants] = useState<ConflictedParticipant[]>([]);
    const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

    // Delete Participant Confirmation State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [participantToDelete, setParticipantToDelete] = useState<string | null>(null);

    const [isPending, setIsPending] = useState(false);

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
            const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const enabled = allDays.filter((_, idx) => !event.excludedDays.includes(idx));

            setFormState({
                title: event.title,
                description: event.description || "",
                scheduleType: event.type === 'monthly' ? 'date' : 'datetime',
                startDate: event.startDate,
                endDate: event.endDate,
                startHour: event.startTime ? Number(event.startTime.split(':')[0]) : 9,
                endHour: event.endTime ? Number(event.endTime.split(':')[0]) : 18,
                enabledDays: enabled,
                deadline: event.deadline ? event.deadline.substring(0, 16) : "",
            });

            setLoading(false);
        };
        init();
    }, [id, pop]);

    const updateForm = (updates: Partial<ModifyFormState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("title", formState.title);
        formData.set("description", formState.description);
        formData.set("scheduleType", formState.scheduleType);
        formData.set("startDate", formState.startDate);
        formData.set("endDate", formState.endDate);
        if (formState.scheduleType === 'datetime') {
            formData.set("startHour", formState.startHour.toString());
            formData.set("endHour", formState.endHour.toString());
        }
        formData.set("enabledDays", JSON.stringify(formState.enabledDays));
        if (formState.deadline) {
            formData.set("deadline", formState.deadline);
        }

        setIsPending(true);
        startTransition(async () => {
            console.log("Submitting form data...");
            const result = await updateEvent(id, formData, false); // First try without confirm
            console.log("Update result:", result);

            if (result.requiresConfirmation && result.conflictedParticipants) {
                setConflictedParticipants(result.conflictedParticipants);
                setPendingFormData(formData);
                setShowConflictDialog(true);
                setIsPending(false);
            } else if (result.success) {
                setIsPending(false);
                replace("Dashboard", {});
            } else {
                alert(result.error || "수정 중 오류가 발생했습니다.");
                setIsPending(false);
            }
        });
    };

    const handleConfirmConflict = async () => {
        if (!pendingFormData) return;
        setShowConflictDialog(false);
        setIsPending(true);

        startTransition(async () => {
            const result = await updateEvent(id, pendingFormData, true); // Confirm delete
            console.log("Confirm result:", result);
            if (result.success) {
                setIsPending(false);
                replace("Dashboard", {});
            } else {
                alert(result.error || "수정 중 오류가 발생했습니다.");
                setIsPending(false);
            }
        });
    };

    const handleDeleteParticipant = (participantId: string) => {
        setParticipantToDelete(participantId);
        setShowDeleteDialog(true);
    };

    const handleConfirmDeleteParticipant = async () => {
        if (!participantToDelete) return;
        setShowDeleteDialog(false);

        const result = await deleteParticipant(participantToDelete);
        if (result.success) {
            setParticipants(prev => prev.filter(p => p.id !== participantToDelete));
        } else {
            alert(result.error || "참여자 삭제 실패");
        }
    };

    return {
        loading,
        isPending,
        formState,
        participants,
        updateForm, // Replaces individual setters
        handleSubmit,

        // Conflict Dialog
        showConflictDialog,
        setShowConflictDialog,
        conflictedParticipants,
        handleConfirmConflict,

        // Delete Dialog
        showDeleteDialog,
        setShowDeleteDialog,
        handleDeleteParticipant,
        handleConfirmDeleteParticipant,

        pop
    };
}
