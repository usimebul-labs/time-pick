"use client";

import { useState } from "react";
import { ActivityLayout } from "@/common/components/ActivityLayout";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { DateRangeSection } from "./components/DateRangeSection";
import { DeadlineSection } from "./components/DeadlineSection";
import { DeleteParticipantDialog } from "./components/DeleteParticipantDialog";
import { ExcludedDaysSection } from "./components/ExcludedDaysSection";
import { ExclusionsSection } from "./components/ExclusionsSection";
import { ModifyFooter } from "./components/ModifyFooter";
import { ModifyLoading } from "./components/ModifyLoading";
import { ParticipantSection } from "./components/ParticipantSection";
import { useModifyInit } from "./hooks/useModifyInit";
import { useModifyForm } from "./hooks/useModifyForm";

export default function Modify({ params: { id } }: { params: { id: string } }) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const { loading } = useModifyInit(id);
    const { handleSubmit } = useModifyForm(id);

    if (loading) return <ModifyLoading />;

    return (
        <ActivityLayout appBar={{ title: "일정 수정하기" }} className="bg-slate-50" contentRef={setContainer}>
            <form id="modify-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-8">
                <BasicInfoSection />
                <DateRangeSection />
                <hr />
                <ExcludedDaysSection />
                <ExclusionsSection />
                <DeadlineSection />
                <hr />
                <ParticipantSection />
            </form>

            <ModifyFooter formId="modify-form" />

            <DeleteParticipantDialog
                container={container}
            />

        </ActivityLayout>
    );
}
