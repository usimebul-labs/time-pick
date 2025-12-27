import { Input, Label, Textarea } from "@repo/ui";
import { ModifyFormState } from "../hooks/types";

interface BasicInfoSectionProps {
    data: ModifyFormState;
    onChange: (updates: Partial<ModifyFormState>) => void;
}

export function BasicInfoSection({ data, onChange }: BasicInfoSectionProps) {
    return (
        <section className="space-y-6">
            <div className="space-y-2">
                <Label className="text-base font-bold text-slate-900 block">
                    일정 제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                    name="title"
                    value={data.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    className="bg-white h-12 text-base"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label className="text-base font-bold text-slate-900 block">설명</Label>
                <Textarea
                    name="description"
                    value={data.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    className="bg-white resize-none min-h-[120px] text-base"
                />
            </div>
        </section>
    );
}
