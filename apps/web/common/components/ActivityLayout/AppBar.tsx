"use client";

import { useFlow } from "@/stackflow";
import { cn } from "@repo/ui";
import { useStack } from "@stackflow/react";
import { ChevronLeft } from "lucide-react";

interface AppBarProps {
    title?: React.ReactNode;
    right?: React.ReactNode;
    className?: string;
}

export function AppBar({ title, right, className }: AppBarProps) {
    const stack = useStack();
    const { pop } = useFlow();
    const canGoBack = stack.activities.filter(
        (activity) => activity.transitionState === "enter-done"
    ).length > 1;

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        pop();
    };

    return (
        <header className={cn("sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-14 flex items-center justify-between px-4 transition-all duration-200", className)}>
            <div className="flex items-center gap-2 min-w-[40px]">
                {canGoBack && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="p-1 -ml-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                {title && (
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight text-center truncate max-w-[200px]">
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-2 min-w-[40px] justify-end">
                {right}
            </div>
        </header>
    );
}
