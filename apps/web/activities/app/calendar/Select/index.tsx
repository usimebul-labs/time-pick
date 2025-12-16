"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { parseISO } from "date-fns";
import { useSelectStore } from "./hooks/useSelectStore";
import { useSelectData } from "./hooks/useSelectData";
import { CalendarSection } from "./components/CalendarSection";
import { ParticipantList } from "./components/ParticipantList";
import { EventDetails } from "./components/EventDetails";
import { SelectFooter } from "./components/SelectFooter";
import { SelectShareDialog } from "./components/SelectShareDialog";

export default function Select({ params: { id } }: { params: { id: string } }) {
    // 1. Data (Main Component only responsible for data fetching)
    const {
        event,
        loading,
        error,
        participants,
        participation,
        isLoggedIn
    } = useSelectData(id);

    // 2. Global State Reset (Shared responsibility, but orchestration belongs here or in a hook?)
    // User asked for "Main component fetches initial data only".
    // Resetting store on unmount is technically a cleanup side effect.
    // It's safer to keep it here or in useSelectData?
    // useSelectData is about fetching.
    // Let's call a simple effect here or rely on the components to clean up?
    // Actually, useSelectStore has a reset.
    // Let's add a simple cleanup effect here to ensure fresh state on mount.
    const reset = useSelectStore((state) => state.reset);

    useEffect(() => {
        // Cleanup on unmount
        return () => reset();
    }, [reset]);

    if (loading) return (
        <AppScreen>
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </AppScreen>
    );

    if (error || !event) return (
        <AppScreen>
            <div className="flex flex-col justify-center items-center h-screen p-4 text-center bg-gray-50">
                <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                <h2 className="text-lg font-bold mb-1">오류가 발생했습니다</h2>
                <p className="text-gray-500">{error || "일정을 찾을 수 없습니다."}</p>
            </div>
        </AppScreen>
    );

    return (
        <AppScreen>
            {/* Initialize connection between Data and Store */}
            <StateInitializer participation={participation} />

            <div className="flex flex-col h-full bg-white">
                <div className="flex-1 overflow-y-auto p-4 pb-32">
                    <CalendarSection
                        event={event}
                        participants={participants}
                    />

                    <div className="w-full h-px bg-gray-100 mt-3 mb-6"></div>

                    <ParticipantList
                        event={event}
                        participants={participants}
                        participation={participation}
                    />

                    <EventDetails event={event} />
                </div>

                <SelectFooter
                    id={id}
                    event={event}
                    participation={participation}
                    isLoggedIn={isLoggedIn}
                />
            </div>
            <SelectShareDialog id={id} />
        </AppScreen >
    );
}

// Helper to handle initialization side-effects without cluttering main logic
import { ParticipantDetail } from "@/app/actions/calendar";

function StateInitializer({ participation }: { participation: ParticipantDetail | null }) {
    const setSelectedDates = useSelectStore((state) => state.setSelectedDates);

    useEffect(() => {
        if (participation?.availabilities) {
            setSelectedDates(participation.availabilities.map((d: string) => parseISO(d)));
        }
    }, [participation, setSelectedDates]); // Safe to ignore parseISO dep

    return null;
}
