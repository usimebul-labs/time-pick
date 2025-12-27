import { useEffect } from "react";
import { useFlow } from "@/stackflow";
import { getCalendarWithParticipation } from "@/app/actions/calendar";
import { useModifyStore } from "../stores/useModifyStore";

export function useModifyInit(id: string) {
    const { pop } = useFlow();
    const { setLoading, setParticipants, setFormState, loading } = useModifyStore();

    useEffect(() => {
        const init = async () => {
            const { calendar, participants, error } = await getCalendarWithParticipation(id);
            if (error || !calendar) {
                alert(error || "일정을 불러올 수 없습니다.");
                pop();
                return;
            }

            setParticipants(participants);

            // Initialize Form
            const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const enabled = allDays.filter((_, idx) => !calendar.excludedDays.includes(idx));

            setFormState({
                title: calendar.title,
                description: calendar.description || "",
                scheduleType: calendar.type === 'monthly' ? 'date' : 'datetime',
                startDate: calendar.startDate,
                endDate: calendar.endDate,
                startHour: calendar.startTime ? Number(calendar.startTime.split(':')[0]) : 9,
                endHour: calendar.endTime ? Number(calendar.endTime.split(':')[0]) : 18,
                enabledDays: enabled,
                excludeHolidays: calendar.excludeHolidays,
                excludedDates: calendar.excludedDates,
                deadline: calendar.deadline ? calendar.deadline.substring(0, 16) : "",
            });

            setLoading(false);
        };
        init();
    }, [id, pop, setLoading, setParticipants, setFormState]);

    return { loading };
}
