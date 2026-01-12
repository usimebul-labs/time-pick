"use client";

import LoadingOverlay from "@/common/components/LoadingOverlay";
import dynamic from "next/dynamic";

const Stack = dynamic(() => import("@/stackflow").then((mod) => mod.Stack), {
    ssr: false,
});

export default function StackClient() {
    return (
        <div className="md:!flex md:justify-center md:items-center min-h-screen md:bg-slate-200">
            <div className="w-full min-h-screen md:max-w-md bg-white md:overflow-hidden relative">
                <LoadingOverlay />
                <Stack />
            </div>
        </div>
    );
}
