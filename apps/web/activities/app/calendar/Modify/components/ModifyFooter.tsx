import { Button } from "@repo/ui";

interface ModifyFooterProps {
    isPending: boolean;
    formId: string;
}

export function ModifyFooter({ isPending, formId }: ModifyFooterProps) {
    return (
        <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10">
            <Button
                type="submit"
                form={formId}
                size="xl"
                className="w-full font-bold shadow-lg rounded-xl"
                disabled={isPending}
            >
                {isPending ? "저장 중..." : "수정사항 저장"}
            </Button>
        </div>
    );
}
