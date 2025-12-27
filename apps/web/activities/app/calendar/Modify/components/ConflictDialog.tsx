import { AlertTriangle } from "lucide-react";
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
import { ConflictedParticipant } from "../hooks/types";

interface ConflictDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conflictedParticipants: ConflictedParticipant[];
    onConfirm: () => void;
}

export function ConflictDialog({ open, onOpenChange, conflictedParticipants, onConfirm }: ConflictDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md w-[90%] rounded-lg">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-lg">
                            참여자 일정 충돌
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-base text-gray-600">
                        일정을 수정하면 아래 참여자들의 가능한 시간이 범위에서 벗어나게 됩니다.
                    </AlertDialogDescription>

                    <div className="my-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs font-semibold text-red-600 mb-2">
                            삭제될 참여자 ({conflictedParticipants.length}명)
                        </p>
                        <div className="max-h-32 overflow-y-auto pr-2 space-y-1">
                            {conflictedParticipants.map(p => (
                                <div key={p.id} className="text-sm text-red-800 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        수정을 진행하면 해당 참여자들의 <strong>참여 이력(가능한 시간)이 초기화</strong>됩니다.<br />
                        계속 진행하시겠습니까?
                    </p>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white border-0"
                    >
                        초기화하고 수정하기
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
