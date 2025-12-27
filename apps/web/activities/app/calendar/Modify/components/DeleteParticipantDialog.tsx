import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@repo/ui";
import { useModifyStore } from "../stores/useModifyStore";
import { useParticipantManagement } from "../hooks/useParticipantManagement";



interface DeleteParticipantDialogProps {
    container?: HTMLElement | null;
}

export function DeleteParticipantDialog({ container }: DeleteParticipantDialogProps) {
    const { showDeleteDialog, setDeleteDialog } = useModifyStore();
    const { handleConfirmDeleteParticipant } = useParticipantManagement();

    return (
        <AlertDialog open={showDeleteDialog} onOpenChange={setDeleteDialog}>
            <AlertDialogContent className="w-[90%] max-w-md rounded-lg" portalContainer={container}>
                <AlertDialogHeader>
                    <AlertDialogTitle>참여자 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                        정말로 이 참여자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDeleteParticipant} className="bg-red-600 hover:bg-red-700">
                        삭제
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
