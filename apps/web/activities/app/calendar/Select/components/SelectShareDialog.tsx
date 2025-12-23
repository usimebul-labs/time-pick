"use client";

import { useSelectShare } from "../hooks/useSelectShare";
import { ShareCalendarDialog } from "@repo/ui";

interface SelectShareDialogProps {
    id: string;
}

export function SelectShareDialog({ id }: SelectShareDialogProps) {
    const { isShareOpen, setIsShareOpen, shareLink } = useSelectShare(id);

    return (
        <ShareCalendarDialog
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            link={shareLink}
            portal={false}
        />
    );
}
