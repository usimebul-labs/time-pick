"use client";

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { useEffect } from "react";
import { parseISO } from "date-fns";
import { useSelectStore } from "./hooks/useSelectStore";
import { useSelectData } from "./hooks/useSelectData";
import { CalendarSection } from "./components/CalendarSection";
import { ParticipantList } from "./components/ParticipantList";
import { CalendarDetails } from "./components/CalendarDetails";
import { SelectFooter } from "./components/SelectFooter";
import { SelectShareDialog } from "./components/SelectShareDialog";
import { SelectLoading } from "./components/SelectLoading";
import { SelectError } from "./components/SelectError";

import { HomeButton } from "@/common/components/ActivityLayout/HomeButton";
import { useFlow } from "@/stackflow";

export default function Select({ params: { id } }: { params: { id: string } }) {
    const { calendar, loading, error, participants, participation, isLoggedIn } = useSelectData(id);
    const reset = useSelectStore((state) => state.reset);
    const { replace } = useFlow();

    useEffect(() => {
        return () => reset();
    }, [reset]);

    if (loading) return <SelectLoading />;
    if (error || !calendar) return <SelectError message={error ?? undefined} />;


    return (
        <ActivityLayout appBar={{ title: "일정 선택하기" }} >
            <StateInitializer participation={participation} />

            <div className="flex-1 overflow-y-auto p-4">
                <CalendarSection calendar={calendar} participants={participants} />

                <div className="w-full h-px bg-gray-100 mt-3 mb-6"></div>
                <ParticipantList calendar={calendar} participants={participants} participation={participation} />
                <CalendarDetails calendar={calendar} />
            </div>

            <SelectFooter id={id} calendar={calendar} participation={participation} isLoggedIn={isLoggedIn} />
            <SelectShareDialog id={id} />
        </ActivityLayout >
    );
}


import { ParticipantDetail } from "@/app/actions/calendar";

function StateInitializer({ participation }: { participation: ParticipantDetail | null }) {
    const setSelectedDates = useSelectStore((state) => state.setSelectedDates);

    useEffect(() => {
        if (participation?.availabilities) {
            setSelectedDates(participation.availabilities.map((d: string) => parseISO(d)));
        }
    }, [participation, setSelectedDates]);

    return null;
}
