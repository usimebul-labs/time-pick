"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Stack = dynamic(() => import("../stackflow").then((mod) => mod.Stack), {
  ssr: false,
});

export default function Page() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <Stack />;
  }

  return (
    <div className="lg:flex lg:justify-center lg:items-center min-h-screen lg:bg-slate-200 lg:py-10">
      <div className="w-full min-h-screen lg:min-h-0 lg:max-w-[430px] lg:h-[calc(100vh-5rem)] lg:max-h-[932px] bg-white lg:rounded-[2.5rem] lg:shadow-2xl lg:overflow-hidden lg:ring-8 lg:ring-neutral-900 lg:border-4 lg:border-neutral-900 relative">
        <Stack />
      </div>
    </div>
  );
}
