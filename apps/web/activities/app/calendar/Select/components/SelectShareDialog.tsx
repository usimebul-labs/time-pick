"use client";

import { ShareCalendarSheet } from "@/common/components/ShareCalendarSheet";
import { useSelectShare } from "../hooks/useSelectShare";

interface SelectShareDialogProps {
    id: string;
}

export function SelectShareDialog({ id }: SelectShareDialogProps) {
    const { isShareOpen, setIsShareOpen, shareLink } = useSelectShare(id);

    return (
        <ShareCalendarSheet
            title="일정 공유하기"
            description="친구들에게 일정을 공유해보세요."
            open={isShareOpen}
            onOpenChange={() => setIsShareOpen(false)}
            link={shareLink}
        />
    );
}
