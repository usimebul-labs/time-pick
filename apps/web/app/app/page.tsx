"use client";

import dynamic from "next/dynamic";

const Stack = dynamic(() => import("../../stackflow").then((mod) => mod.Stack), {
    ssr: false,
});

export default function Page() {
    return <Stack />;
}
