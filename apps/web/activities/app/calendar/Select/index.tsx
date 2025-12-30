"use client";

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { ShareCalendarSheet } from "@/common/components/ShareCalendarSheet";
import { useEffect } from "react";
import { CalendarDetails } from "./components/CalendarDetails";
import { CalendarSection } from "./components/CalendarSection";
import { ParticipantList } from "./components/ParticipantList";
import { SelectError } from "./components/SelectError";
import { SelectFooter } from "./components/SelectFooter";
import { SelectLoading } from "./components/SelectLoading";
import { useSelectData } from "./hooks/useSelectData";
import { useSelectShare } from "./hooks/useSelectShare";
import { useSelectStore } from "./hooks/useSelectStore";


export default function Select({ params: { id } }: { params: { id: string } }) {
    const { calendar, loading, error, participants, participation, isLoggedIn } = useSelectData(id);
    const reset = useSelectStore((state) => state.reset);
    const { isShareOpen, setIsShareOpen, shareLink } = useSelectShare(id);

    useEffect(() => {
        return () => reset();
    }, [reset]);

    if (loading) return <SelectLoading />;
    if (error || !calendar) return <SelectError message={error ?? undefined} />;


    return (
        <ActivityLayout appBar={{ title: "일정 선택하기" }} >
            <div className="flex-1 overflow-y-auto p-4">
                <CalendarSection calendar={calendar} participants={participants} />

                <div className="w-full h-px bg-gray-100 mt-3 mb-6"></div>
                <ParticipantList calendar={calendar} participants={participants} participation={participation} />
                <CalendarDetails calendar={calendar} />
            </div>

            <SelectFooter id={id} calendar={calendar} participation={participation} isLoggedIn={isLoggedIn} />
            <ShareCalendarSheet
                title="일정 공유하기"
                description="친구들에게 일정을 공유해보세요."
                open={isShareOpen}
                onOpenChange={(open) => !open && setIsShareOpen(false)}
                link={shareLink}
            />
        </ActivityLayout >
    );
}