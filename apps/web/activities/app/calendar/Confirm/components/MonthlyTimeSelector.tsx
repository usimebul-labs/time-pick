import { Input } from "@repo/ui";

interface MonthlyTimeSelectorProps {
    time: string;
    onTimeChange: (val: string) => void;
}

export function MonthlyTimeSelector({
    time,
    onTimeChange
}: MonthlyTimeSelectorProps) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            <label className="text-sm font-medium text-gray-600">시작 시간</label>
            <div className="relative">
                <Input
                    type="time"
                    value={time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTimeChange(e.target.value)}
                    className="w-full h-12 rounded-2xl border-gray-200 bg-gray-50 px-4 text-base font-medium focus:bg-white transition-all"
                />
            </div>
        </div>
    );
}
