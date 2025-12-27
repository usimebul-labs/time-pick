import { ParticipantList } from "@/common/components/participant/ParticipantList";
import { Card, CardContent, Label } from "@repo/ui";
import { useParticipantManagement } from "../hooks/useParticipantManagement";
import { useModifyStore } from "../stores/useModifyStore";

export function ParticipantSection() {
    const { participants } = useModifyStore();
    const { handleDeleteParticipant } = useParticipantManagement();

    return (
        <section>
            <Label className="text-base font-bold text-slate-900 mb-2 block">참여자 관리</Label>
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    <ParticipantList
                        participants={participants}
                        interaction="removable"
                        onDelete={handleDeleteParticipant}
                    />
                </CardContent>
            </Card>
        </section>
    );
}

