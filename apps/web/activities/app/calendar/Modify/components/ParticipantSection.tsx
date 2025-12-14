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
            <Label className="text-base font-bold mb-2 block">참여자 관리</Label>
            <Card className="border-none shadow-sm">
                <CardContent className="p-0 divide-y">
                    {participants.length > 0 ? (
                        participants.map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={p.avatarUrl || ""} alt={p.name} />
                                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{p.name}</span>
                                        {p.email && <span className="text-xs text-gray-400">{p.email}</span>}
                                        {p.isGuest && (
                                            <span className="text-xs text-gray-400">
                                                {format(parseISO(p.createdAt), "MM.dd HH:mm", { locale: ko })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onDelete(p.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            참여자가 없습니다.
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
