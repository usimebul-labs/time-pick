"use client";

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { ReactNode } from "react";
import { useFlow } from "../../../../../stackflow";
import { HomeButton } from "@/common/components/ActivityLayout/HomeButton";


interface CreateLayoutProps {
    children: ReactNode;
    title: string;
    step: number;
    totalSteps?: number;
}

export default function CreateLayout({ children, step, totalSteps = 5 }: CreateLayoutProps) {
    return (
        <ActivityLayout appBar={{ title: "일정 생성 하기" }} className="bg-slate-50">
            {/* Progress Bar */}
            <div className="bg-white px-6 py-5 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] z-10 relative">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500 ease-in-out rounded-full"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-300 font-medium px-1">
                    <span className={step >= 1 ? "text-indigo-600 font-bold" : "transition-colors duration-300"}>기본 정보</span>
                    <span className={step >= 2 ? "text-indigo-600 font-bold" : "transition-colors duration-300"}>유형</span>
                    <span className={step >= 3 ? "text-indigo-600 font-bold" : "transition-colors duration-300"}>기간</span>
                    <span className={step >= 4 ? "text-indigo-600 font-bold" : "transition-colors duration-300"}>제외</span>
                    <span className={step >= 5 ? "text-indigo-600 font-bold" : "transition-colors duration-300"}>마감</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {children}
            </div>
        </ActivityLayout>
    );
}
