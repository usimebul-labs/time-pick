"use client";

import { CalendarDetail, ParticipantDetail } from "@/app/actions/calendar";
import { useLoading } from "@/common/LoadingOverlay/useLoading";
import { useGuestStore } from "@/common/stores/useGuestStore";
import { useFlow } from "@stackflow/react/future";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectStore } from "./useSelectStore";

export function useSelectFooter(
    id: string,
    calendar: CalendarDetail | null,
    participation: ParticipantDetail | null,
    isLoggedIn: boolean
) {
    const { replace } = useFlow();
    const { selectedDates } = useSelectStore();
    const queryClient = useQueryClient();
    const { show, hide } = useLoading();


    const createGuest = async () => {
        const pendingGuest = useGuestStore.getState().pendingGuest;
        const isPendingGuest = pendingGuest && pendingGuest.calendarId === id;

        if (!isPendingGuest) return

        const { createGuestParticipant } = await import("@/app/actions/calendar");
        const result = await createGuestParticipant(id, pendingGuest.name);

        if (!result.success) throw new Error(result.error || "게스트 생성 실패")

        const guest = JSON.parse("{}");
        guest[id] = result.pin;
        localStorage.setItem("guest_sessions", JSON.stringify(guest));
        useGuestStore.getState().clearPendingGuest();
    }

    const checkLogin = () => {
        const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
        let guestPin = guestSessions[id];

        if (!participation && !guestPin && !isLoggedIn) {
            alert("로그인이 필요합니다.");
            replace("Join", { id });
            return;
        }

        return guestPin;
    }

    const joinCalendar = async (guestPin: string) => {
        if (!calendar) return;

        const { joinSchedule } = await import("@/app/actions/calendar");
        let result = await joinSchedule(calendar.id, selectedDates.map(d => d.toISOString()), { pin: guestPin });

        if (!result.success) throw new Error(result.error || "일정 등록 실패");

        await queryClient.invalidateQueries({ queryKey: ['calendar', id] });
        alert("일정이 등록되었습니다.");
        replace("Status", { id: calendar.id });

    }

    const handleComplete = async () => {
        try {
            show()
            await createGuest();
            const guestPin = checkLogin();
            await joinCalendar(guestPin);
        } catch (e: any) {
            alert(e?.message);
        } finally {
            hide();
        }
    };

    return {
        selectedCount: selectedDates.length,
        handleComplete
    };
}
