"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ReactNode } from "react";
import { useFlow } from "../../../../../stackflow";

interface CreateLayoutProps {
    children: ReactNode;
    title: string;
    step: number;
    totalSteps?: number;
    onBack?: () => void;
}

export default function CreateLayout({
    children,
    title,
    step,
    totalSteps = 5,
    onBack,
}: CreateLayoutProps) {
    const { pop } = useFlow();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            // pop();
        }
    };

    return (
        <AppScreen
            appBar={{
                title,
                backButton: {
                    ariaLabel: "뒤로 가기",
                    onClick: handleBack,
                },
            }}
        >
            <div className="flex flex-col h-full bg-slate-50">
                {/* Progress Bar */}
                <div className="bg-white px-4 pt-2 pb-0">
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 mb-2 font-medium">
                        <span className={step >= 1 ? "text-indigo-600 font-bold" : ""}>기본 정보</span>
                        <span className={step >= 2 ? "text-indigo-600 font-bold" : ""}>유형</span>
                        <span className={step >= 3 ? "text-indigo-600 font-bold" : ""}>기간</span>
                        <span className={step >= 4 ? "text-indigo-600 font-bold" : ""}>제외</span>
                        <span className={step >= 5 ? "text-indigo-600 font-bold" : ""}>마감</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-24">
                    {children}
                </div>
            </div>
        </AppScreen>
    );
}
