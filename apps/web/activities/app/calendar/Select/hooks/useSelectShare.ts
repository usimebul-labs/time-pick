"use client";

import { useState, useEffect } from "react";

export function useSelectShare(id: string) {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");

    useEffect(() => {
        setShareLink(`${window.location.origin}/app/calendar/${id}/join`);
        const lastCreatedId = sessionStorage.getItem("lastCreatedEventId");
        if (lastCreatedId === id) setIsShareOpen(true)

        return () => sessionStorage.removeItem("lastCreatedEventId");
    }, [id]);

    return {
        isShareOpen,
        shareLink,
        setIsShareOpen,
    };
}
