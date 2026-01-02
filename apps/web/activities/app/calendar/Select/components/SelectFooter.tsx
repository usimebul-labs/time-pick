"use client";

import { useSelectFooter } from "../hooks/useSelectFooter";
import { Button } from "@repo/ui";
import { CalendarDetail, ParticipantDetail } from "@/app/actions/calendar";

interface SelectFooterProps {
    id: string;
    calendar: CalendarDetail;
    participation: ParticipantDetail | null;
    isLoggedIn: boolean;
}

export function SelectFooter({ id, calendar, participation, isLoggedIn }: SelectFooterProps) {
    const { selectedCount, handleComplete, isSubmitting } = useSelectFooter(id, calendar, participation, isLoggedIn);

    return (
        <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-white via-white to-transparent">
            <Button
                size="xl"
                className="w-full font-bold shadow-lg rounded-xl"
                onClick={handleComplete}
                disabled={isSubmitting}
            >
                {selectedCount}개 시간 선택 완료
            </Button>
        </div>
    );
}
