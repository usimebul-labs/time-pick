
import { ActivityLayout } from "@/common/components/ActivityLayout";
import { AlertCircle } from "lucide-react";

interface SelectErrorProps {
    message?: string;
}

export function SelectError({ message }: SelectErrorProps) {
    return (
        <ActivityLayout>
            <div className="flex flex-col justify-center items-center h-full p-4 text-center bg-slate-50">
                <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                <h2 className="text-lg font-bold mb-1 text-slate-900">오류가 발생했습니다</h2>
                <p className="text-slate-500">{message || "일정을 찾을 수 없습니다."}</p>
            </div>
        </ActivityLayout>
    );
}
