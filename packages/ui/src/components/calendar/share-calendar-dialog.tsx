"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../sheet";

interface ShareCalendarDialogProps {
    isOpen: boolean;
    onClose: () => void;
    link: string;
}

export function ShareCalendarDialog({
    isOpen,
    onClose,
    link,
}: ShareCalendarDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "일정 초대",
                    text: "일정에 초대합니다!",
                    url: link,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            handleCopy();
            alert("링크가 복사되었습니다.");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="bottom" className="rounded-t-xl">
                <SheetHeader className="text-left mb-4">
                    <SheetTitle>캘린더가 생성되었습니다!</SheetTitle>
                    <SheetDescription>
                        링크를 공유하여 친구들을 초대해보세요.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <Label>초대 링크</Label>
                        <div className="flex gap-2">
                            <Input value={link} readOnly className="flex-1 bg-gray-50" />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full gap-2 h-12 text-base"
                        onClick={handleShare}
                    >
                        <Share2 className="h-4 w-4" />
                        공유하기
                    </Button>
                </div>

                <SheetFooter>
                    <Button onClick={onClose} className="w-full h-12 text-base">
                        확인 (일정으로 이동)
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
