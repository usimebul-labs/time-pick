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
    const { selectedCount, handleComplete } = useSelectFooter(id, calendar, participation, isLoggedIn);

    return (
        <div className="border-t bg-white p-4 shadow-lg z-20 sticky bottom-0">
            <Button
                className="w-full h-12 text-base"
                onClick={handleComplete}
            >
                {selectedCount}개 시간 선택 완료
            </Button>
        </div>
    );
}
