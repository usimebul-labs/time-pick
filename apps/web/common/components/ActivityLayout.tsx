"use client";

import { AppBarProps, AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { cn } from "@repo/ui";
import { HomeButton } from "./HomeButton";

interface ActivityLayoutProps {
    children: React.ReactNode;
    appBar?: AppBarProps;
    className?: string; // For the content container
    backgroundColor?: string;
}

import { useLoginedUser } from "@/common/hooks/useLoginedUser";

import { useStack } from "@stackflow/react";
import { useFlow } from "@stackflow/react/future";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
    const { pop } = useFlow();

    const handleBack = () => {
        pop();
    };

    return <button onClick={handleBack} className="p-1 -ml-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
        <ChevronLeft className="w-6 h-6" />
    </button>
}

export function ActivityLayout({ children, appBar, className, backgroundColor }: ActivityLayoutProps) {
    const { user } = useLoginedUser();
    const stack = useStack();
    const canGoBack = stack.activities.length > 1;

    appBar = appBar || {};

    if (!appBar.backButton && !canGoBack)
        appBar.backButton = {
            render: () => <BackButton />
        };


    if (!appBar.renderRight && user) appBar.renderRight = () => <HomeButton />


    return (
        <AppScreen backgroundColor={backgroundColor} appBar={appBar}>
            <div className={cn("flex-1 overflow-hidden flex flex-col relative h-full", className)}>
                {children}
            </div>
        </AppScreen>
    );
}
