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
    hideAppBar?: boolean
}

import { useLoginedUser } from "@/common/hooks/useLoginedUser";

import { AppBar } from "./AppBar";


export function ActivityLayout({ children, appBar, className, backgroundColor, hideAppBar }: ActivityLayoutProps) {
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
                <div className={cn("flex-1 overflow-hidden flex flex-col relative", className)}>
                    {children}
                </div>
            </div>
        </AppScreen>
    );
}
