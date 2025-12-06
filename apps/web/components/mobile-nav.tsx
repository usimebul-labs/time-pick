"use client";

import * as React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Button } from "@repo/ui";
import { Menu } from "lucide-react";

interface MobileNavProps {
    isLoggedIn: boolean;
}

export function MobileNav({ isLoggedIn }: MobileNavProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">메뉴 열기</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader className="text-left mb-6">
                    <SheetTitle>TimePick</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    {isLoggedIn ? (
                        <Button asChild size="lg" className="w-full">
                            <Link href="/app/dashboard" onClick={() => setOpen(false)}>대시보드</Link>
                        </Button>
                    ) : (
                        <>
                            <Link
                                href="/app/login"
                                className="text-lg font-medium hover:text-primary transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                로그인
                            </Link>
                            <hr className="border-border" />
                            <Button asChild size="lg" className="w-full">
                                <Link href="/app" onClick={() => setOpen(false)}>앱 실행</Link>
                            </Button>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
