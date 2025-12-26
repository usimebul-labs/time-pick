"use client";

import { Input, Label, Textarea, Button } from "@repo/ui";
import { ArrowRight } from "lucide-react";
import { useBasicInfo } from "../hooks/useBasicInfo";
import CreateLayout from "./CreateLayout";

export default function CreateBasicInfo() {
    const { data, updateData, handleNext } = useBasicInfo();

    return (
        <CreateLayout title="일정 만들기" step={1} totalSteps={5}>
            <section className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-base font-bold block text-slate-900">
                        어떤 모임인가요? <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        name="title"
                        placeholder="예: 팀 주간 회의, 점심 약속"
                        value={data.title}
                        onChange={(e) => updateData({ title: e.target.value })}
                        className="bg-white h-12 text-base border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                        required
                        autoFocus
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-base font-bold block text-slate-900">메모 (선택)</Label>
                    <Textarea
                        name="description"
                        placeholder="일정에 대한 간단한 설명을 적어주세요."
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        className="bg-white resize-none min-h-[120px] text-base border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                    />
                </div>
            </section>

            <div className="p-5 pb-8 pt-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-10 w-full fixed bottom-0 left-0 right-0 max-w-md mx-auto">
                <Button size="xl" className="w-full font-bold shadow-lg rounded-xl" onClick={handleNext}>
                    다음
                    <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
                </Button>
            </div>
        </CreateLayout>
    );
}
