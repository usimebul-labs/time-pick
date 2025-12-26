"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingOverlay from "@/common/components/LoadingOverlay";

const Stack = dynamic(() => import("../stackflow").then((mod) => mod.Stack), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <Stack />
    </>
  );
}
