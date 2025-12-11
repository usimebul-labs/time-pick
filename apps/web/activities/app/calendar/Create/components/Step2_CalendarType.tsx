
import { Card, CardContent, Label, RadioGroup, RadioGroupItem } from "@repo/ui";
import { CreateCalendarData } from "../types";
import { Calendar, Clock, CalendarDays } from "lucide-react";

interface Step2Props {
    data: CreateCalendarData;
    updateData: (updates: Partial<CreateCalendarData>) => void;
}

export default function Step2_CalendarType({ data, updateData }: Step2Props) {
    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold">캘린더 유형을 선택해주세요</h2>

            <RadioGroup
                value={data.scheduleType}
                onValueChange={(val) => updateData({ scheduleType: val as "date" | "datetime" })}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Monthly (Date Only) */}
                <Label
                    htmlFor="type-monthly"
                    className={`
                        cursor-pointer border-2 rounded-xl p-6 transition-all hover:bg-gray-50
                        ${data.scheduleType === 'date' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}
                    `}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <CalendarDays className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-lg">월간 캘린더</span>
                        </div>
                        <RadioGroupItem value="date" id="type-monthly" className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        날짜 위주로 일정을 잡을 때 적합합니다.<br />
                        하루 단위로 참석 가능 여부를 투표합니다.
                    </p>
                    {/* Visual Mockup - Monthly */}
                    <div className="bg-white border rounded p-2 grid grid-cols-7 gap-1 text-center pointer-events-none opacity-80">
                        {["일", "월", "화", "수", "목", "금", "토"].map(d => <div key={d} className="text-[10px] text-gray-400">{d}</div>)}
                        {Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className={`h-4 rounded-sm ${[4, 5, 8, 10].includes(i) ? 'bg-blue-200' : 'bg-gray-100'}`} />
                        ))}
                    </div>
                </Label>

                {/* Weekly (Date + Time) */}
                <Label
                    htmlFor="type-weekly"
                    className={`
                        cursor-pointer border-2 rounded-xl p-6 transition-all hover:bg-gray-50
                        ${data.scheduleType === 'datetime' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}
                    `}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-lg">주간 캘린더</span>
                        </div>
                        <RadioGroupItem value="datetime" id="type-weekly" className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                        시간 단위로 세밀하게 조율할 때 적합합니다.<br />
                        특정 시간대(예: 14:00~16:00)를 선택합니다.
                    </p>
                    {/* Visual Mockup - Weekly (Columns) */}
                    <div className="bg-white border rounded p-2 flex justify-between gap-1 pointer-events-none opacity-80 h-[88px] overflow-hidden">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex-1 flex flex-col gap-1">
                                <div className="h-2 bg-gray-100 rounded-sm mb-1" />
                                <div className={`flex-1 rounded-sm ${i % 2 === 0 ? 'bg-purple-100 mt-2 mb-4' : 'bg-gray-50'}`} />
                            </div>
                        ))}
                    </div>
                </Label>
            </RadioGroup>
        </section>
    );
}
