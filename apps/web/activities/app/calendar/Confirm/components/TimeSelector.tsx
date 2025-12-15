
import { Input } from "@repo/ui";

interface TimeSelectorProps {
    type: 'monthly' | 'weekly';
    duration: number;
    onDurationChange: (val: number) => void;
    time: string;
    onTimeChange: (val: string) => void;
}

export function TimeSelector({
    type,
    duration,
    onDurationChange,
    time,
    onTimeChange
}: TimeSelectorProps) {

    if (type === 'weekly') {
        return (
            <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-2 w-full">
                    <label className="text-sm font-medium text-gray-600">
                        몇 시간 동안 만날까요?
                    </label>
                    <div className="relative">
                        <select
                            className="flex h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                            value={duration.toString()}
                            onChange={(e) => onDurationChange(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5, 6].map((h) => (
                                <option key={h} value={h.toString()}>
                                    {h}시간
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            ▼
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
