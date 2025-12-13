"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useEffect, useState } from "react";
import { ShareCalendarDialog } from "@repo/ui";
import { useFlow } from "@/stackflow";

type ShareProps = {
    params: {
        id: string;
    };
};

export default function Share({ params: { id } }: ShareProps) {
    const { replace, pop } = useFlow();
    const [link, setLink] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLink(`${window.location.origin}/app/calendar/${id}`);
        }
    }, [id]);

    const handleClose = () => {
        // If we just created it, we probably want to go to the created calendar or dashboard?
        // The dialog usually has "Confirm" or "Close". 
        // Let's assume closing means "Done" -> Go to Join (which is the calendar view for participants/hosts)
        replace("Join", { id }, { animate: false });
    };

    return (
        <AppScreen>
            {/* We reuse the dialog UI but present it as a full screen or just open the dialog immediately over a blank/loading bg */}
            <ShareCalendarDialog
                isOpen={true}
                onClose={handleClose}
                link={link}
            />
        </AppScreen>
    );
}
