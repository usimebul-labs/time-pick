import { Plus, Share2 } from "lucide-react";
import { ShareCalendarSheet } from "@/common/components/ShareCalendarSheet";
import { useResultStore } from "../stores/useResultStore";

interface ResultFooterProps {
    id: string; // Calendar ID for sharable link
}

export function ResultFooter({ id }: ResultFooterProps) {
    const { isShareOpen, setShareOpen } = useResultStore();

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-100 flex gap-3 z-50 safe-area-bottom">
                <button
                    onClick={() => alert("준비 중인 기능입니다.")}
                    className="flex-2 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-base hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />캘린더에 추가
                </button>
                <button
                    onClick={() => setShareOpen(true)}
                    className="flex-[1.5] py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    공유하기
                </button>
            </div>

            <ShareCalendarSheet
                title="일정 초대"
                description="일정에 초대합니다!"
                open={isShareOpen}
                onOpenChange={setShareOpen}
                link={`${window.location.origin}/app/calendar/${id}/result`}
            />
        </>
    );
}
