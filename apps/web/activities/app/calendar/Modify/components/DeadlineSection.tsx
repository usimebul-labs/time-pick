import { Card, CardContent, Checkbox, Input, Label } from "@repo/ui";
import { ModifyFormState } from "../hooks/types";

interface DeadlineSectionProps {
    data: ModifyFormState;
    onChange: (updates: Partial<ModifyFormState>) => void;
}

export function DeadlineSection({ data, onChange }: DeadlineSectionProps) {
    const isUnlimited = !data.deadline;

    const handleUnlimitedChange = (checked: boolean) => {
        if (checked) {
            onChange({ deadline: "" });
        } else {
            // Default to end date end of day, or now if not set
            const defaultDate = data.endDate ? `${data.endDate}T23:59` : new Date().toISOString().slice(0, 16);
            onChange({ deadline: defaultDate });
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-bold text-slate-900 block">응답 마감일</Label>
            </div>

            <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                    id="unlimited"
                    checked={isUnlimited}
                    onCheckedChange={handleUnlimitedChange}
                />
                <label
                    htmlFor="unlimited"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    마감 시간은 정하지 않을래요
                </label>
            </div>

            {!isUnlimited && (
                <Card className="border-none shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <CardContent className="p-4">
                        <Input
                            type="datetime-local"
                            value={data.deadline}
                            onChange={(e) => onChange({ deadline: e.target.value })}
                        />
                    </CardContent>
                </Card>
            )}
        </section>
    );
}
