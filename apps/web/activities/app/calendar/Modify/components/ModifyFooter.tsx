import { Button } from "@repo/ui";

interface ModifyFooterProps {
    isPending: boolean;
    formId: string;
}

export function ModifyFooter({ isPending, formId }: ModifyFooterProps) {
    return (
        <div className="p-4 bg-white border-t fixed bottom-0 left-0 right-0 safe-area-bottom z-10">
            <Button
                type="submit"
                form={formId}
                className="w-full text-lg h-12 font-bold"
                disabled={isPending}
            >
                {isPending ? "저장 중..." : "수정사항 저장"}
            </Button>
        </div>
    );
}
