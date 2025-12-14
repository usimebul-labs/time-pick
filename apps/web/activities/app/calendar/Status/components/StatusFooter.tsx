interface StatusFooterProps {
    onEdit: () => void;
    onComplete: () => void;
}

export function StatusFooter({ onEdit, onComplete }: StatusFooterProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 pb-8 z-30 flex gap-3">
            <button
                onClick={onEdit}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
            >
                일정 수정하기 ✏️
            </button>
            <button
                onClick={onComplete}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
            >
                확인했어요 👌
            </button>
        </div>
    );
}
