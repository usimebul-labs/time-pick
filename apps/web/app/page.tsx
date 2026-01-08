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
    <div className="lg:!flex lg:justify-center lg:items-center min-h-screen lg:bg-slate-200">
      <div className="w-full min-h-screen max-w-md bg-white lg:overflow-hidden relative">
        <Stack />
      </div>
    </div >
  );
}
