"use client";

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { ConflictDialog } from "./components/ConflictDialog";
import { DateRangeSection } from "./components/DateRangeSection";
import { DeadlineSection } from "./components/DeadlineSection";
import { DeleteParticipantDialog } from "./components/DeleteParticipantDialog";
import { ExcludedDaysSection } from "./components/ExcludedDaysSection";
import { ExclusionsSection } from "./components/ExclusionsSection";
import { ModifyFooter } from "./components/ModifyFooter";
import { ModifyLoading } from "./components/ModifyLoading";
import { ParticipantSection } from "./components/ParticipantSection";
import { useModify } from "./hooks/useModify";

export default function Modify({ params: { id } }: { params: { id: string } }) {
    const {
        loading,
        isPending,
        formState,
        participants,
        updateForm,
        handleSubmit,
        showConflictDialog,
        setShowConflictDialog,
        conflictedParticipants,
        handleConfirmConflict,
        showDeleteDialog,
        setShowDeleteDialog,
        handleDeleteParticipant,
        handleConfirmDeleteParticipant,
    } = useModify(id);

    if (loading) return <ModifyLoading />;


    return (
        <ActivityLayout appBar={{ title: "일정 수정하기" }} className="bg-slate-50">
            <form id="modify-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-8">
                <BasicInfoSection data={formState} onChange={updateForm} />
                <DateRangeSection data={formState} onChange={updateForm} />
                <hr />
                <ExcludedDaysSection data={formState} onChange={updateForm} />
                <ExclusionsSection data={formState} onChange={updateForm} />
                <DeadlineSection data={formState} onChange={updateForm} />
                <hr />
                <ParticipantSection participants={participants} onDelete={handleDeleteParticipant} />
            </form>

            <ModifyFooter isPending={isPending} formId="modify-form" />

            <ConflictDialog
                open={showConflictDialog}
                onOpenChange={setShowConflictDialog}
                conflictedParticipants={conflictedParticipants}
                onConfirm={handleConfirmConflict}
            />

            <DeleteParticipantDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleConfirmDeleteParticipant}
            />
        </ActivityLayout>
    );
}
