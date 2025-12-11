
import { Input, Label, Textarea } from "@repo/ui";
import { CreateCalendarData } from "../types";

interface Step1Props {
    data: CreateCalendarData;
    updateData: (updates: Partial<CreateCalendarData>) => void;
}

export default function Step1_BasicInfo({ data, updateData }: Step1Props) {
    return (
        <section className="space-y-6">
            <div className="space-y-2">
                <Label className="text-lg font-semibold block">일정 제목 <span className="text-red-500">*</span></Label>
                <Input
                    name="title"
                    placeholder="예: 팀 주간 회의, 점심 약속"
                    value={data.title}
                    onChange={(e) => updateData({ title: e.target.value })}
                    className="bg-white h-12 text-base"
                    required
                    autoFocus
                />
            </div>
            <div className="space-y-2">
                <Label className="text-lg font-semibold block">설명 (선택)</Label>
                <Textarea
                    name="description"
                    placeholder="일정에 대한 간단한 설명을 적어주세요."
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    className="bg-white resize-none min-h-[120px] text-base"
                />
            </div>
        </section>
    );
}
