import { deleteParticipant } from "@/app/actions/calendar";
import { useModifyStore } from "../stores/useModifyStore";

export function useParticipantManagement() {
    const {
        participantToDelete,
        removeParticipant,
        setDeleteDialog,
        setParticipantToDelete
    } = useModifyStore();

    const handleDeleteParticipant = (participantId: string) => {
        setParticipantToDelete(participantId);
        setDeleteDialog(true);
    };

    const handleConfirmDeleteParticipant = async () => {
        if (!participantToDelete) return;

        // Optimistic update locally or wait for result?
        // Let's modify valid action first.
        setDeleteDialog(false);

        const result = await deleteParticipant(participantToDelete);
        if (result.success) {
            removeParticipant(participantToDelete);
            setParticipantToDelete(null);
        } else {
            alert(result.error || "참여자 삭제 실패");
        }
    };

    return { handleDeleteParticipant, handleConfirmDeleteParticipant };
}
