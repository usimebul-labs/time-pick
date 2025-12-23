import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@repo/ui";
import { CheckCircle, Settings, Trash2 } from "lucide-react";

interface DashboardMenuSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eventId: string | null;
    onModify: (id: string) => void;
    onConfirm: (id: string) => void;
    onDelete: (id: string) => void;
}

export function DashboardMenuSheet({ open, onOpenChange, eventId, onModify, onConfirm, onDelete }: DashboardMenuSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent portal={false} side="bottom" className="rounded-t-xl p-0 overflow-hidden bg-white">
                <SheetHeader className="p-6 pb-2 text-left">
                    <SheetTitle className="text-xl font-bold">일정 더보기</SheetTitle>
                    <SheetDescription className="text-sm text-slate-500">
                        원하는 작업을 선택해주세요.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-3 p-6 pt-4">
                    <Button variant="secondary" size="xl"
                        className="w-full justify-start text-base font-medium"
                        onClick={() => eventId && onModify(eventId)}
                    >
                        <Settings className="mr-2 h-5 w-5 text-slate-400" />
                        일정 수정하기
                    </Button>

                    <Button variant="outline" size="xl"
                        className="w-full justify-start text-base font-medium border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                        onClick={() => eventId && onDelete(eventId)}
                    >
                        <Trash2 className="mr-2 h-5 w-5" />
                        일정 삭제하기
                    </Button>
                    <Button variant="default" size="xl" className="w-full justify-start text-base font-bold bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => eventId && onConfirm(eventId)}
                    >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        일정 확정 하기
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
