"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Button, Input, Label } from "@repo/ui";
import { useState } from "react";
import { createGuestParticipant } from "@/app/actions/calendar";
import { ArrowRight } from "lucide-react";
import { useFlow } from "@/stackflow";

type GuestLoginProps = {
    params: {
        id: string;
    };
};

export default function GuestLogin({ params: { id } }: GuestLoginProps) {
    const { replace } = useFlow();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const result = await createGuestParticipant(id, name);
            if (result.success && result.pin) {
                // Save session
                const sessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
                sessions[id] = result.pin;
                localStorage.setItem("guest_sessions", JSON.stringify(sessions));

                // Redirect back to Join
                replace("Join", { id }, { animate: false });
            } else {
                alert(result.error || "게스트 등록 실패");
            }
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppScreen appBar={{ title: "모임 참여" }}>
            <div className="flex flex-col h-full bg-white p-6">
                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">반가워요! 👋</h1>
                        <p className="text-gray-500">
                            모임에 참여하려면 이름을 알려주세요.
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
        </AppScreen>
    );
}
