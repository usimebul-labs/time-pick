"use client";

import { cn } from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { HomeButton } from "./HomeButton";

interface ActivityLayoutProps {
    children: React.ReactNode;
    appBar?: {
        title?: React.ReactNode;
        right?: React.ReactNode;
    };
    className?: string;
    backgroundColor?: string;
    hideAppBar?: boolean;
    contentRef?: React.Ref<HTMLDivElement>;
}

import { useLoginedUser } from "@/common/hooks/useLoginedUser";

import { AppBar } from "./AppBar";


export function ActivityLayout({ children, appBar, className, backgroundColor, hideAppBar, contentRef }: ActivityLayoutProps) {
    const { user } = useLoginedUser();

    return (
        <AppScreen backgroundColor={backgroundColor}>
            <div className="flex flex-col h-full">
                {!hideAppBar && (
                    <AppBar
                        title={appBar?.title}
                        right={appBar?.right ? appBar.right : user && <HomeButton />}
                    />
                )}
                <div ref={contentRef} className={cn("flex-1 overflow-hidden flex flex-col relative", className)}>
                    {children}
                </div>
            </div>
        </AppScreen>
    );
}
