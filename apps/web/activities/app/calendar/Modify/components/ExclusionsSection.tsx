import { Button, Card, CardContent, Input, Label, Checkbox } from "@repo/ui";
import { X } from "lucide-react";
import { useModifyStore } from "../stores/useModifyStore";

export function ExclusionsSection() {
    const { formState, updateForm } = useModifyStore();

    // Helper to add excluded date
    const addExcludedDate = (date: string) => {
        if (!formState.excludedDates.includes(date)) {
            updateForm({ excludedDates: [...formState.excludedDates, date] });
        }
    };

    // Helper to remove excluded date
    const removeExcludedDate = (date: string) => {
        updateForm({ excludedDates: formState.excludedDates.filter(d => d !== date) });
    };

    return (
        <section className="space-y-4">
            <label
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${formState.excludeHolidays ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
            >
                <div>
                    <span className="text-base font-bold text-slate-900 block mb-0.5">공휴일은 쉴까요?</span>
                    <span className="text-xs text-slate-500">
                        달력의 빨간 날은 자동으로 제외해요.
                    </span>
                </div>
                <Checkbox
                    checked={formState.excludeHolidays}
                    onCheckedChange={(checked) => updateForm({ excludeHolidays: checked === true })}
                    className="w-5 h-5 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
            </label>

            {/* Specific Dates */}
            <div className="space-y-3">
                <Label className="text-base font-bold block text-slate-900">이 날은 안 돼요 (선택)</Label>
                <div className="flex gap-2">
                    <Input
                        type="date"
                        className="flex-1 bg-white border-slate-200 rounded-xl"
                        onChange={(e) => {
                            if (e.target.value) {
                                addExcludedDate(e.target.value);
                                e.target.value = ""; // Reset input
                            }
                        }}
                    />
                </div>
                <Card className="bg-gray-50 border-none">
                    <CardContent className="p-3">
                        {formState.excludedDates.length === 0 ? (
                            <p className="text-xs text-center text-gray-400 py-2">
                                제외된 날짜가 없습니다.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {formState.excludedDates.map((date: string) => (
                                    <div
                                        key={date}
                                        className="flex items-center bg-white border border-slate-200 px-2 py-1 rounded-lg text-sm text-slate-700 shadow-sm"
                                    >
                                        <span>{date}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeExcludedDate(date)}
                                            className="ml-2 text-slate-400 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
