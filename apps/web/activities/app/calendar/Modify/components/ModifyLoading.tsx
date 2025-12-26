
import { ActivityLayout } from "@/common/components/ActivityLayout";
import { Skeleton } from "@repo/ui";
import { HomeButton } from "@/common/components/ActivityLayout/HomeButton";

export function ModifyLoading() {
    return (
        <ActivityLayout
            title="일정 수정하기"
            appBar={{
                right: <HomeButton className="text-slate-400" disabled />
            }}
            className="bg-slate-50"
        >
            <div className="flex-1 overflow-hidden flex flex-col p-4 space-y-8 animate-pulse">
                {/* Basic Info Skeleton */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                </div>

                {/* Date Range Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                    </div>
                </div>

                <div className="w-full h-px bg-slate-200" />

                {/* Excluded Days Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="flex gap-2 justify-between">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Exclusions & Deadline Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>

                <div className="w-full h-px bg-slate-200" />

                {/* Participant Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="p-5 pb-8 pt-4 border-t border-slate-100 bg-white">
                <Skeleton className="h-14 w-full rounded-xl" />
            </div>
        </ActivityLayout>
    );
}
