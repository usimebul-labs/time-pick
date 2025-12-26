"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { AppBar } from "./AppBar";
import React from "react";
import { cn } from "@repo/ui";

interface ActivityLayoutProps {
    children: React.ReactNode;
    title?: string;
    appBar?: {
        left?: React.ReactNode;
        right?: React.ReactNode;
        onBack?: () => void;
        className?: string;
    };
    hideAppBar?: boolean;
    className?: string; // For the content container
    backgroundColor?: string;
}

export function ActivityLayout({ children, title, appBar, hideAppBar, className, backgroundColor }: ActivityLayoutProps) {
    return (
        <AppScreen backgroundColor={backgroundColor}>
            <div className="flex flex-col h-full">
                {!hideAppBar && (
                    <AppBar
                        title={title}
                        left={appBar?.left}
                        right={appBar?.right}
                        onBack={appBar?.onBack}
                        className={appBar?.className}
                    />
                )}
                <div className={cn("flex-1 overflow-hidden flex flex-col relative", className)}>
                    {children}
                </div>
            </div>
        </AppScreen>
    );
}
