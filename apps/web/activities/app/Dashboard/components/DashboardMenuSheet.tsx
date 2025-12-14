import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@repo/ui";
import { CheckCircle, Settings, Trash2 } from "lucide-react";

interface DashboardMenuSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    scheduleId: string | null;
    onModify: (id: string) => void;
    onConfirm: (id: string) => void;
    onDelete: (id: string) => void;
}

export function DashboardMenuSheet({
    open,
    onOpenChange,
    scheduleId,
    onModify,
    onConfirm,
    onDelete
}: DashboardMenuSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-2xl p-0 overflow-hidden bg-white">
                <SheetHeader className="p-6 pb-2 text-left">
                    <SheetTitle className="text-xl font-bold">일정 더보기</SheetTitle>
                    <SheetDescription className="text-sm text-gray-500">
                        원하는 작업을 선택해주세요.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 p-6 pt-4">
                    <Button
                        variant="outline"
                        className="w-full h-14 text-base font-medium justify-start px-4 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                        onClick={() => scheduleId && onModify(scheduleId)}
                    >
                        <Settings className="mr-3 h-5 w-5 text-gray-400" />
                        일정 수정하기
                    </Button>
                    <Button
                        className="w-full h-14 text-base font-bold justify-start px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all"
                        onClick={() => scheduleId && onConfirm(scheduleId)}
                    >
                        <CheckCircle className="mr-3 h-5 w-5" />
                        약속 확정 하기
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-14 text-base font-medium justify-start px-4 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                        onClick={() => scheduleId && onDelete(scheduleId)}
                    >
                        <Trash2 className="mr-3 h-5 w-5" />
                        일정 삭제하기
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
