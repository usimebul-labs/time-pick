
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Skeleton } from "@repo/ui";

export function SelectLoading() {
    return (
        <AppScreen>
            <div className="flex flex-col h-full bg-white">
                <div className="flex-1 overflow-y-auto p-4 pb-32">
                    {/* Calendar Section Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>

                    <div className="w-full h-px bg-gray-100 mt-6 mb-6"></div>

                    {/* Participant List Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-12 rounded-full flex-shrink-0" />
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 mt-6 mb-6"></div>

                    {/* Event Details Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    </div>
                </div>

                {/* Footer Skeleton */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>
        </AppScreen>
    );
}
