"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useModify } from "./useModify";
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

    if (loading) {
        return (
            <AppScreen>
                <div className="flex items-center justify-center min-h-screen bg-slate-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </AppScreen>
        );
    }

    return (
        <AppScreen
            appBar={{
                title: "일정 수정하기",
                backButton: {
                    onClick: () => pop(),
                },
            }}
        >
            <div className="flex flex-col h-full bg-slate-50">
                <form id="modify-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-8 pb-32">
                    <BasicInfoSection data={formState} onChange={updateForm} />
                    <DateRangeSection data={formState} onChange={updateForm} />
                    <ExcludedDaysSection data={formState} onChange={updateForm} />
                    <ExclusionsSection data={formState} onChange={updateForm} />
                    <DeadlineSection data={formState} onChange={updateForm} />
                    <ParticipantSection participants={participants} onDelete={handleDeleteParticipant} />
                </form>

                <ModifyFooter isPending={isPending} formId="modify-form" />
            </div>

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
        </AppScreen>
    );
}
