
"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button, Input, Label, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@repo/ui";

interface EventShareSheetProps {
    isOpen: boolean;
    onClose: () => void;
    link: string;
}

export function EventShareSheet({ isOpen, onClose, link }: EventShareSheetProps) {
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
                <SheetHeader className="text-left mb-6">
                    <SheetTitle className="text-xl font-bold text-slate-900">일정 공유하기</SheetTitle>
                    <SheetDescription className="text-slate-500">
                        친구들에게 일정을 공유해서 알려보세요.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mb-8">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">초대 링크</Label>
                        <div className="flex gap-2">
                            <Input
                                value={link}
                                readOnly
                                className="flex-1 bg-slate-50 border-slate-200 text-slate-600 font-medium"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="shrink-0 border-slate-200 hover:bg-slate-50 relative"
                            >
                                <div className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                    <Check className="h-4 w-4 text-green-500" />
                                </div>
                                <div className={`transition-all duration-200 absolute inset-0 flex items-center justify-center ${copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                                    <Copy className="h-4 w-4 text-slate-500" />
                                </div>
                            </Button>
                        </div>
                    </div>

                    <Button
                        className="w-full gap-2 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100"
                        onClick={handleShare}
                    >
                        <Share2 className="h-5 w-5" />
                        공유하기
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
