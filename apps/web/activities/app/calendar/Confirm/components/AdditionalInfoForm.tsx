
import { Input } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { Button } from "@repo/ui";
import { Plus, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { Label } from "@repo/ui";

export type AdditionalInfo = {
    location: string;
    transport: string;
    parking: string;
    fee: string;
    bank: string;
    inquiry: string;
    memo: string;
    customFields: { label: string; value: string }[];
};

interface AdditionalInfoFormProps {
    info: AdditionalInfo;
    onChange: (info: AdditionalInfo) => void;
}

export function AdditionalInfoForm({ info, onChange }: AdditionalInfoFormProps) {
    const handleChange = (field: keyof AdditionalInfo, value: string) => {
        onChange({ ...info, [field]: value });
    };

    const handleCustomFieldChange = (index: number, field: 'label' | 'value', value: string) => {
        const newFields = [...info.customFields];
        if (newFields[index]) {
            newFields[index]![field] = value;
            onChange({ ...info, customFields: newFields });
        }
    };

    const addCustomField = () => {
        onChange({
            ...info,
            customFields: [...info.customFields, { label: "", value: "" }]
        });
    };

    const removeCustomField = (index: number) => {
        const newFields = info.customFields.filter((_, i) => i !== index);
        onChange({ ...info, customFields: newFields });
    };

    const handleMapCheck = () => {
        if (!info.location) return;
        // Open generalized map search
        const query = encodeURIComponent(info.location);
        window.open(`https://map.naver.com/p/search/${query}`, '_blank');
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <Label className="text-gray-600 font-medium">장소</Label>
                <div className="flex space-x-2">
                    <Input
                        className="h-12 rounded-2xl border-gray-200 bg-gray-50 px-4 focus:bg-white transition-all"
                        value={info.location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('location', e.target.value)}
                        placeholder="어디서 만날까요?"
                    />
                    <Button variant="outline" size="icon" onClick={handleMapCheck} title="지도 확인" className="h-12 w-12 rounded-2xl border-gray-200 hover:bg-gray-50">
                        <MapPin className="h-5 w-5 text-gray-600" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">교통 편의</Label>
                    <Input
                        className="h-11 rounded-2xl border-gray-200 bg-gray-50 px-4 focus:bg-white"
                        value={info.transport}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('transport', e.target.value)}
                        placeholder="예: 강남역 1번 출구"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">주차 정보</Label>
                    <Input
                        className="h-11 rounded-2xl border-gray-200 bg-gray-50 px-4 focus:bg-white"
                        value={info.parking}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('parking', e.target.value)}
                        placeholder="예: 무료 주차 가능"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">회비</Label>
                    <Input
                        className="h-11 rounded-2xl border-gray-200 bg-gray-50 px-4 focus:bg-white"
                        value={info.fee}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('fee', e.target.value)}
                        placeholder="예: 30,000원"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">입금 계좌</Label>
                    <Input
                        className="h-11 rounded-2xl border-gray-200 bg-gray-50 px-4 focus:bg-white"
                        value={info.bank}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('bank', e.target.value)}
                        placeholder="예: 카카오뱅크 1234..."
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">문의처</Label>
                    <Input
                        className="h-11 rounded-2xl border-gray-200 bg-gray-50 px-4 focus:bg-white"
                        value={info.inquiry}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('inquiry', e.target.value)}
                        placeholder="연락처 입력"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-600 font-medium">메모</Label>
                <Textarea
                    className="min-h-[100px] rounded-2xl border-gray-200 bg-gray-50 p-4 focus:bg-white resize-none"
                    value={info.memo}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('memo', e.target.value)}
                    placeholder="친구들에게 남길 말을 적어주세요."
                />
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <Label className="text-gray-600 font-medium">추가 항목</Label>
                    <Button variant="ghost" size="sm" onClick={addCustomField} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full">
                        <Plus className="h-4 w-4 mr-1" /> 항목 추가
                    </Button>
                </div>

                {info.customFields.map((field, index) => (
                    <div key={index} className="flex space-x-2 items-start">
                        <Input
                            className="w-1/3 h-10 rounded-xl border-gray-200 bg-gray-50 px-3 text-sm focus:bg-white"
                            placeholder="항목명"
                            value={field.label}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomFieldChange(index, 'label', e.target.value)}
                        />
                        <Input
                            className="flex-1 h-10 rounded-xl border-gray-200 bg-gray-50 px-3 text-sm focus:bg-white"
                            placeholder="내용"
                            value={field.value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomFieldChange(index, 'value', e.target.value)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeCustomField(index)}>
                            <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
