import { Input, Label, Textarea } from "@repo/ui";
import { ModifyFormState } from "../hooks/types";

import { useModifyStore } from "../stores/useModifyStore";

export function BasicInfoSection() {
    const { formState, updateForm } = useModifyStore();

    return (
        <section className="space-y-6">
            <div className="space-y-2">
                <Label className="text-base font-bold text-slate-900 block">
                    일정 제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                    name="title"
                    value={formState.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    className="bg-white h-12 text-base"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label className="text-base font-bold text-slate-900 block">설명</Label>
                <Textarea
                    name="description"
                    value={formState.description}
                    onChange={(e) => updateForm({ description: e.target.value })}
                    className="bg-white resize-none min-h-[120px] text-base"
                />
            </div>
        </section>
    );
}
