"use client";

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { ShareCalendarSheet } from "@/common/components/ShareCalendarSheet";
import { useFlow } from "@/stackflow";
import { useEffect, useState } from "react";

type ShareProps = {
    params: {
        id: string;
    };
};

export default function Share({ params: { id } }: ShareProps) {
    const { replace } = useFlow();
    const [link, setLink] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLink(`${window.location.origin}/app/calendar/${id}`);
        }
    }, [id]);

    const handleClose = () => {
        replace("Select", { id }, { animate: false });
    };

    return (
        <ActivityLayout hideAppBar>
            {/* We reuse the dialog UI but present it as a full screen or just open the dialog immediately over a blank/loading bg */}
            <ShareCalendarSheet
                title="일정 공유하기"
                description="친구들에게 일정을 공유해보세요."
                open={true}
                onOpenChange={handleClose}
                link={link}
            />
        </ActivityLayout>
    );
}
