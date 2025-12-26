"use client";

import { useGuestStore } from "@/common/stores/useGuestStore";
import { useFlow } from "@/stackflow";
import { CalendarDetail, ParticipantDetail } from "@/app/actions/calendar";
import { useQueryClient } from "@tanstack/react-query";

export function useSelectAction(
    id: string,
    calendar: CalendarDetail | null,
    participation: ParticipantDetail | null,
    isLoggedIn: boolean,
    selectedDates: Date[]
) {
    const { replace } = useFlow();
    const queryClient = useQueryClient();

    const handleComplete = async () => {
        if (!calendar) return;
        try {
            const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
            let guestPin = guestSessions[id];

            const pendingGuest = useGuestStore.getState().pendingGuest;
            const isPendingGuest = pendingGuest && pendingGuest.calendarId === id;

            // 1. Create Guest if pending
            if (isPendingGuest && !guestPin) {
                const { createGuestParticipant } = await import("@/app/actions/calendar");
                const result = await createGuestParticipant(id, pendingGuest.name);

                if (result.success && result.pin) {
                    guestPin = result.pin;
                    // Persist session
                    guestSessions[id] = guestPin;
                    localStorage.setItem("guest_sessions", JSON.stringify(guestSessions));
                    useGuestStore.getState().clearPendingGuest();
                    replace("Status", { id: calendar.id });
                } else {
                    alert(result.error || "게스트 생성 실패");
                    return;
                }
            }

            if (!participation && !guestPin && !isLoggedIn) {
                alert("로그인이 필요합니다.");
                replace("Join", { id });
                return;
            }

            const { joinSchedule } = await import("@/app/actions/calendar");
            let result = await joinSchedule(calendar.id, selectedDates.map(d => d.toISOString()), { pin: guestPin });

            if (result.success) {
                await queryClient.invalidateQueries({ queryKey: ['calendar', id] });
                alert("일정이 등록되었습니다.");
                replace("Status", { id: calendar.id });
            } else {
                alert(result.error);
            }

        } catch (e) {
            console.error(e);
            alert("오류가 발생했습니다.");
        }
    };

    return {
        handleComplete
    };
}
