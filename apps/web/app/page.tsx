"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingOverlay from "@/common/components/LoadingOverlay";

const Stack = dynamic(() => import("../stackflow").then((mod) => mod.Stack), {
  ssr: false,
});

export default function Page() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <>
        <Stack />
      </>
    );
  }

  return (
    <div className="md:!flex md:justify-center md:items-center min-h-screen md:bg-slate-200">
      <div className="w-full min-h-screen md:max-w-md bg-white md:overflow-hidden relative">
        <LoadingOverlay />
        <Stack />
      </div>
    </div>
  );
}
