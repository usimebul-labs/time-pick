"use client";

import { Button, Input, Label, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@repo/ui";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";


interface ShareCalendarDialogProps {
    title: string;
    description: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    link: string;
}

export function ShareCalendarSheet({ title, description, open, onOpenChange, link }: ShareCalendarDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        await navigator.share({
            title: "일정 초대",
            text: "일정에 초대합니다!",
            url: link,
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-xl" portal={false}>
                <SheetHeader className="text-left mb-4">
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <Label>초대 링크</Label>
                        <div className="flex gap-2">
                            <Input value={link} readOnly className="flex-1 bg-gray-50" />
                            <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
                                {copied ?
                                    <Check className="h-4 w-4 text-green-500" /> :
                                    <Copy className="h-4 w-4" />
                                }
                            </Button>
                        </div>
                    </div>

                    <Button className="w-full gap-2 h-12 text-base" onClick={handleShare} disabled={!navigator.share}>
                        <Share2 className="h-4 w-4" />
                        공유하기
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
