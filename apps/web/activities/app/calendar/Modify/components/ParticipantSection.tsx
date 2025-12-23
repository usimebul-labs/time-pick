import { SharedParticipantList } from "@/components/common/SharedParticipantList";
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, Label } from "@repo/ui";
import { Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { ParticipantSummary } from "@/app/actions/calendar";

interface ParticipantSectionProps {
    participants: ParticipantSummary[];
    onDelete: (id: string) => void;
}

export function ParticipantSection({ participants, onDelete }: ParticipantSectionProps) {
    return (
        <section>
            <Label className="text-base font-bold text-slate-900 mb-2 block">참여자 관리</Label>
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    <SharedParticipantList
                        participants={participants}
                        mode="list"
                        interaction="removable"
                        onDelete={onDelete}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
