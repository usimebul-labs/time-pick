'use client';

import { useEffect, useState } from "react";
import { cn } from "@repo/ui";

interface AppIconProps {
    appName: string;
    className?: string;
    alt: string;
}

export function AppIcon({ appName, className, alt }: AppIconProps) {
    const [iconUrl, setIconUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchIcon = async () => {
            try {
                const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(appName)}&country=KR&media=software&limit=1`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    setIconUrl(data.results[0].artworkUrl512 || data.results[0].artworkUrl100);
                }
            } catch (error) {
                console.error("Failed to fetch app icon", error);
            }
        };

        fetchIcon();
    }, [appName]);

    if (!iconUrl) {
        // Fallback or skeleton
        return <div className={cn("bg-slate-100 animate-pulse", className)} />;
    }

    return (
        <img
            src={iconUrl}
            alt={alt}
            className={cn("object-cover", className)}
        />
    );
}
