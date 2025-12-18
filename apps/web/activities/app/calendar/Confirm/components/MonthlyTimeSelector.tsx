import { Input, Label } from "@repo/ui";
import { Clock } from "lucide-react";

interface MonthlyTimeSelectorProps {
    startTime: string;
    onStartTimeChange: (val: string) => void;
    endTime: string;
    onEndTimeChange: (val: string) => void;
}

export function MonthlyTimeSelector({
    startTime,
    onStartTimeChange,
    endTime,
    onEndTimeChange
}: MonthlyTimeSelectorProps) {
    const hasEndTime = !!endTime;

    const handleToggleEndTime = (checked: boolean) => {
        if (checked) {
            // Default to start time + 1 hour or just start time if empty
            if (!endTime) {
                // Simple default: if start is 12:00, end 13:00.
                // Or just set to current startTime to avoid invalidity
                onEndTimeChange(startTime);
            }
        } else {
            onEndTimeChange("");
        }
    };

    return (
        <div className="flex flex-col space-y-4 w-full">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <span>⏰</span> 언제 만날까요?
            </h2>

            <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 ml-1">시작 시간</label>
                    <div className="relative">
                        <Input
                            type="time"
                            value={startTime}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onStartTimeChange(e.target.value)}
                            className="w-full h-12 rounded-xl border-gray-200 bg-gray-50 px-3 text-base font-medium focus:bg-white focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center pt-6 text-gray-400">
                    ~
                </div>

                <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                        <label className={cn("text-xs font-semibold transition-colors", hasEndTime ? "text-gray-500" : "text-gray-300")}>
                            종료 시간
                        </label>
                    </div>

                    <div className="relative">
                        <Input
                            type="time"
                            value={endTime}
                            disabled={!hasEndTime}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEndTimeChange(e.target.value)}
                            className={cn(
                                "w-full h-12 rounded-xl border-gray-200 px-3 text-base font-medium transition-all",
                                hasEndTime
                                    ? "bg-gray-50 focus:bg-white focus:border-indigo-500 text-gray-900"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
                <input
                    type="checkbox"
                    id="no-end-time"
                    checked={hasEndTime}
                    onChange={(e) => handleToggleEndTime(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <Label htmlFor="no-end-time" className="text-sm text-gray-500 cursor-pointer select-none">
                    종료 시간 설정
                </Label>
            </div>
        </div>
    );
}

// Helper util
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}
