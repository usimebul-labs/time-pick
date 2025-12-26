"use client";

import { AppBarProps, AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { cn } from "@repo/ui";
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

import { useStack } from "@stackflow/react";
import { useFlow } from "@stackflow/react/future";
import { ChevronLeft } from "lucide-react";
import { AppBar } from "./AppBar";

const BackButton = () => {
    const { pop } = useFlow();

    const handleBack = () => {
        pop();
    };

    return <button onClick={handleBack} className="p-1 -ml-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
        <ChevronLeft className="w-6 h-6" />
    </button>
}

export function ActivityLayout({ children, appBar, className, backgroundColor, hideAppBar }: ActivityLayoutProps) {
    return (
        <AppScreen backgroundColor={backgroundColor}>
            <div className="flex flex-col h-full">
                {!hideAppBar && (
                    <AppBar
                        title={appBar?.title}
                        right={appBar?.right ? appBar.right : <HomeButton />}
                    />
                )}
                <div className={cn("flex-1 overflow-hidden flex flex-col relative", className)}>
                    {children}
                </div>
            </div>
        </AppScreen>
    );
}
