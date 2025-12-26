"use client";

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { useFlow } from "@/stackflow";
import { Home } from "lucide-react";
import { useModify } from "./useModify";
import { ModifyLoading } from "./components/ModifyLoading";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { DateRangeSection } from "./components/DateRangeSection";
import { ExcludedDaysSection } from "./components/ExcludedDaysSection";
import { ExclusionsSection } from "./components/ExclusionsSection";
import { DeadlineSection } from "./components/DeadlineSection";
import { ParticipantSection } from "./components/ParticipantSection";
import { ModifyFooter } from "./components/ModifyFooter";
import { ConflictDialog } from "./components/ConflictDialog";
import { DeleteParticipantDialog } from "./components/DeleteParticipantDialog";

export default function Modify({ params: { id } }: { params: { id: string } }) {
    const { replace } = useFlow();
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
        pop
    } = useModify(id);

    if (loading) return <ModifyLoading />;


    return (
        <ActivityLayout
            title="일정 수정하기"
            appBar={{
                onBack: pop,
                right: (
                    <button
                        onClick={() => replace("Dashboard", {})}
                        className="p-1 -mr-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <Home className="w-6 h-6" strokeWidth={1.5} />
                    </button>
                )
            }}
            className="bg-slate-50"
        >
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
