"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Button, Input, Label } from "@repo/ui";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useFlow } from "@/stackflow";
import { useGuestStore } from "@/stores/guest";
import { useEventQuery } from "@/hooks/queries/useEventQuery";



export default function Join({ params: { id } }: { params: { id: string } }) {
    const { replace } = useFlow();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [eventTitle, setEventTitle] = useState<string>("");
    const [hostName, setHostName] = useState<string>("");
    const [hostAvatar, setHostAvatar] = useState<string>("");

    const { data } = useEventQuery(id);
    const event = data?.event;

    useEffect(() => {
        if (event) {
            setEventTitle(event.title);
            setHostName(event.hostName || "");
            setHostAvatar(event.hostAvatarUrl || "");
        }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        // Defer creation: Save to store and redirect to Select
        useGuestStore.getState().setPendingGuest(id, name);
        replace("Select", { id }, { animate: false });
    };

    return (
        <AppScreen appBar={{ title: "모임 참여" }}>
            <div className="flex flex-col h-full bg-gray-50 p-6">
                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">

                    {/* Invitation Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center mb-8">
                        {hostAvatar ? (
                            <img
                                src={hostAvatar}
                                alt={hostName}
                                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gray-100 flex items-center justify-center text-2xl">
                                👋
                            </div>
                        )}

                        <div className="mb-6">
                            {hostName && (
                                <p className="text-gray-500 mb-2 font-medium">
                                    {hostName}님의 초대
                                </p>
                            )}
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight break-keep">
                                {eventTitle || "로딩 중..."}
                            </h2>
                        </div>

                        <p className="text-sm text-gray-400">
                            가능한 시간을 알려주세요.<br />
                            가장 좋은 시간을 찾아드릴게요!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="guest-name" className="sr-only">이름</Label>
                            <Input
                                id="guest-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="예: 김민수"
                                className="h-12 text-lg"
                                autoFocus
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full text-base h-12"
                            disabled={loading}
                        >
                            {loading ? "입장 중..." : "입장하기"}
                            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            이미 계정이 있으신가요? <span className="underline cursor-pointer" onClick={() => replace("Login", { next: `/app/calendar/${id}` })}>로그인하기</span>
                        </p>
                    </div>
                </div>
            </div>
        </AppScreen >
    );
}
