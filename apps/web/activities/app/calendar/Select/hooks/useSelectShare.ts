"use client";

import { useState, useEffect } from "react";

export function useSelectShare(id: string) {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShareLink(`${window.location.origin}/app/calendar/${id}`);
            const lastCreatedId = sessionStorage.getItem("lastCreatedEventId");
            if (lastCreatedId === id) {
                setIsShareOpen(true);
                sessionStorage.removeItem("lastCreatedEventId");
            }
        }
    }, [id]);

    return {
        isShareOpen,
        setIsShareOpen,
        shareLink
    };
}
