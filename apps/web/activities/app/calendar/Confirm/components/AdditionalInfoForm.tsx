import { Input } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { Button } from "@repo/ui";
import { MapPin, Bus, Car, Coins, CreditCard, Phone, X, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@repo/ui";
import { cn } from "@repo/ui";


export type AdditionalInfo = {
    location: string;
    transport: string;
    parking: string;
    fee: string;
    bank: string;
    inquiry: string;
    memo: string;
};

interface AdditionalInfoFormProps {
    info: AdditionalInfo;
    onChange: (info: AdditionalInfo) => void;
    monthlyTimeProps?: {
        startTime: string;
        onStartTimeChange: (val: string) => void;
        endTime: string;
        onEndTimeChange: (val: string) => void;
    };
}

type InfoKey = keyof Omit<AdditionalInfo, 'memo'> | 'time';

const FIELD_CONFIG: { key: InfoKey; label: string; placeholder: string; icon: React.ReactNode }[] = [
    { key: 'time', label: '시간', placeholder: '', icon: <Clock className="w-4 h-4" /> },
    { key: 'location', label: '장소', placeholder: '어디서 만날까요?', icon: <MapPin className="w-4 h-4" /> },
    { key: 'transport', label: '교통', placeholder: '예: 강남역 1번 출구', icon: <Bus className="w-4 h-4" /> },
    { key: 'parking', label: '주차', placeholder: '예: 무료 주차 가능', icon: <Car className="w-4 h-4" /> },
    { key: 'fee', label: '회비', placeholder: '예: 30,000원', icon: <Coins className="w-4 h-4" /> },
    { key: 'bank', label: '입금 계좌', placeholder: '예: 카카오뱅크 1234...', icon: <CreditCard className="w-4 h-4" /> },
    { key: 'inquiry', label: '문의처', placeholder: '연락처 입력', icon: <Phone className="w-4 h-4" /> },
];

export function AdditionalInfoForm({ info, onChange, monthlyTimeProps }: AdditionalInfoFormProps) {
    // Initialize active keys based on existing values
    const [activeKeys, setActiveKeys] = useState<Set<InfoKey>>(() => {
        const initial = new Set<InfoKey>();
        FIELD_CONFIG.forEach(({ key }) => {
            if (key === 'time') {
                // If implicit logic: if endTime is set? Or always false?
                // User requirement: "Hidden by default" unless maybe already set?
                // Let's assume false for 'time' unless purely strictly editing mode where we know it was set.
                // But for now, sticking to "hidden by default" pattern.
                // However, if a user *already* set a time, it should be visible.
                // But `endTime` logic for "unspecified" returns empty string.
                // Let's default 'time' to inactive unless strictly required.
                if (monthlyTimeProps?.endTime) {
                    initial.add(key);
                }
            } else {
                // Determine if the key exists in info and is truthy
                // 'time' is already handled, so key is strictly keyof AdditionalInfo (minus custom/memo)
                const fieldKey = key as keyof AdditionalInfo;
                if (info[fieldKey]) initial.add(key);
            }
        });
        return initial;
    });

    const handleChange = (field: keyof AdditionalInfo, value: string) => {
        onChange({ ...info, [field]: value });
    };

    const handleActivate = (key: InfoKey) => {
        setActiveKeys(prev => {
            const next = new Set(prev);
            next.add(key);
            return next;
        });
    };

    const handleDeactivate = (key: InfoKey) => {
        setActiveKeys(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
        // Clear value when removing
        if (key === 'time') {
            monthlyTimeProps?.onEndTimeChange(""); // Reset end time on remove
        } else {
            handleChange(key as keyof AdditionalInfo, "");
        }
    };



    const handleMapCheck = () => {
        if (!info.location) return;
        const query = encodeURIComponent(info.location);
        window.open(`https://map.naver.com/p/search/${query}`, '_blank');
    };

    return (
        <div className="space-y-6 bg-white p-5 rounded-xl shadow-sm border border-slate-200">

            {/* 1. Chips Section (Directly visible) */}
            <div className="flex flex-wrap gap-2">
                {FIELD_CONFIG.map(({ key, label, icon }) => {
                    // Special check for 'time': only show if monthlyTimeProps exists
                    if (key === 'time' && !monthlyTimeProps) return null;

                    const isActive = activeKeys.has(key);
                    if (isActive) return null; // Hide if active

                    return (
                        <button
                            key={key}
                            onClick={() => handleActivate(key)}
                            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                            <span>+</span>
                            {icon}
                            <span>{label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 2. Active Inputs List */}
            <div className="space-y-6">
                {FIELD_CONFIG.map(({ key, label, placeholder, icon }) => {
                    if (!activeKeys.has(key)) return null;

                    // Special Rendering for Time
                    if (key === 'time') {
                        if (!monthlyTimeProps) return null;

                        const { startTime, onStartTimeChange, endTime, onEndTimeChange } = monthlyTimeProps;
                        const hasEndTime = !!endTime;

                        const handleToggleEndTime = (checked: boolean) => {
                            if (checked) {
                                if (!endTime) {
                                    const [hours, minutes] = startTime.split(":");
                                    const nextHour = (Number(hours) + 1).toString().padStart(2, '0');
                                    onEndTimeChange(`${nextHour}:${minutes}`);
                                }
                            } else {
                                onEndTimeChange("");
                            }
                        };

                        return (
                            <div key={key} className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                                        {icon}
                                        {label}
                                    </Label>
                                    <button
                                        onClick={() => handleDeactivate(key)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="flex flex-col space-y-4 w-full pt-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500 ml-1">시작 시간</label>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onStartTimeChange(e.target.value)}
                                                    className="w-full h-10 rounded-xl border-gray-200 bg-gray-50 px-3 text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all"
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
                                                        "w-full h-10 rounded-xl border-gray-200 px-3 text-sm font-medium transition-all",
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
                            </div>
                        );
                    }

                    // Standard Fields
                    return (
                        <div key={key} className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex justify-between items-center px-1">
                                <Label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                                    {icon}
                                    {label}
                                </Label>
                                <button
                                    onClick={() => handleDeactivate(key)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    className="h-11 rounded-xl border-gray-200 bg-white px-3 focus:border-indigo-500 transition-all"
                                    value={info[key as keyof AdditionalInfo] as string}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key as keyof AdditionalInfo, e.target.value)}
                                    placeholder={placeholder}
                                    autoFocus
                                />
                                {key === 'location' && (
                                    <Button variant="outline" size="icon" onClick={handleMapCheck} title="지도 확인" className="h-11 w-11 shrink-0 rounded-xl border-gray-200 hover:bg-gray-50">
                                        <MapPin className="h-5 w-5 text-gray-600" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. Static/Common Fields (Memo) */}
            <div className="space-y-2 pt-2">
                <Label className="text-gray-600 font-medium ml-1">메모</Label>
                <Textarea
                    className="min-h-[100px] rounded-xl border-gray-200 bg-gray-50 p-4 focus:bg-white resize-none"
                    value={info.memo}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('memo', e.target.value)}
                    placeholder="친구들에게 남길 말을 적어주세요."
                />
            </div>
        </div>
    );
}
