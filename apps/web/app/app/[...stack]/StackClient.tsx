"use client";

import LoadingOverlay from "@/common/components/LoadingOverlay";
import dynamic from "next/dynamic";

const Stack = dynamic(() => import("@/stackflow").then((mod) => mod.Stack), {
    ssr: false,
});

export default function StackClient() {
    return (
        <div className="lg:!flex lg:justify-center lg:items-center min-h-screen lg:bg-slate-200">
            <div className="w-full min-h-screen max-w-md bg-white lg:overflow-hidden relative">
                <LoadingOverlay />
                <Stack />
            </div>
        </div>
    );
}
