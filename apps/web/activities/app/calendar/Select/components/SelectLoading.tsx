import { ActivityLayout } from "@/common/components/ActivityLayout";
import { Skeleton } from "@repo/ui";
import { HomeButton } from "@/common/components/HomeButton";

export function SelectLoading() {
    return (
        <ActivityLayout
            title="일정 선택하기"
            appBar={{
                right: <HomeButton className="text-slate-400" disabled />
            }}
            className="bg-white"
        >
            <div className="flex-1 overflow-hidden flex flex-col p-4 animate-pulse">
                {/* Calendar Skeleton */}
                <div className="h-64 bg-gray-100 rounded-xl mb-6"></div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                {/* Participant List Skeleton */}
                <div className="mb-6">
                    <div className="h-6 w-24 bg-gray-100 rounded mb-3"></div>
                    <div className="flex gap-2 overflow-x-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex-shrink-0 w-16 h-20 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                {/* Details Skeleton */}
                <div>
                    <div className="h-6 w-32 bg-gray-100 rounded mb-3"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="p-5 pb-8 pt-4 border-t border-slate-100">
                <div className="h-14 w-full bg-gray-100 rounded-xl"></div>
            </div>
        </ActivityLayout>
    );
}

