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
                    <Label className="text-base font-bold block">
                        어떤 모임인가요? <span className="text-red-500">*</span>
                    </Label>
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
                    <Label className="text-base font-bold block">메모 (선택)</Label>
                    <Textarea
                        name="description"
                        placeholder="일정에 대한 간단한 설명을 적어주세요."
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        className="bg-white resize-none min-h-[120px] text-base"
                    />
                </div>
            </section>

            {/* Float Bottom Button */}
            <div className="p-4 bg-white border-t safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 w-full fixed bottom-0 left-0 right-0 max-w-md mx-auto">
                <Button size="lg" className="w-full text-base" onClick={handleNext}>
                    다음
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </CreateLayout>
    );
}
