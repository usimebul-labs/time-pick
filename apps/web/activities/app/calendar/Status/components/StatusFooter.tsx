interface StatusFooterProps {
    onEdit: () => void;
    onComplete: () => void;
}

export function StatusFooter({ onEdit, onComplete }: StatusFooterProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 pb-8 z-30 flex gap-3">
            <button
                onClick={onEdit}
                className="flex-1 py-3.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                type="button"
            >
                일정 수정하기 ✏️
            </button>
            <button
                onClick={onComplete}
                className="flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                type="button"
            >
                확인했어요 👌
            </button>
        </div>
    );
}
