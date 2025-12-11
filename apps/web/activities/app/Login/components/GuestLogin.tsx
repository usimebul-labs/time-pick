import { useState } from "react";
import { useFlow } from "../../../../stackflow";
import { createGuestParticipant, loginGuestParticipant } from "../../../../app/actions/calendar";
import { Button, Input, Label } from "@repo/ui";

interface GuestLoginProps {
    eventId?: string;
}

export const GuestLogin = ({ eventId }: GuestLoginProps) => {
    const [loading, setLoading] = useState(false);
    const [guestMode, setGuestMode] = useState<"new" | "existing">("new");
    const [guestName, setGuestName] = useState("");
    const [guestPin, setGuestPin] = useState("");
    const [generatedPin, setGeneratedPin] = useState<string | null>(null);

    const { replace } = useFlow();

    const handleGuestCreate = async () => {
        if (!eventId || !guestName) return;
        setLoading(true);
        try {
            const res = await createGuestParticipant(eventId, guestName);
            if (res.success && res.pin) {
                // Save to localStorage
                const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
                guestSessions[eventId] = res.pin;
                localStorage.setItem("guest_sessions", JSON.stringify(guestSessions));

                setGeneratedPin(res.pin);
            } else {
                alert(res.error || "게스트 생성 실패");
            }
        } catch (e) {
            console.error(e);
            alert("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        if (!eventId || !guestPin) return;
        setLoading(true);
        try {
            const res = await loginGuestParticipant(eventId, guestPin);
            if (res.success) {
                // Save to localStorage
                const guestSessions = JSON.parse(localStorage.getItem("guest_sessions") || "{}");
                guestSessions[eventId] = guestPin;
                localStorage.setItem("guest_sessions", JSON.stringify(guestSessions));

                replace("Join", { id: eventId });
            } else {
                alert(res.error || "로그인 실패");
            }
        } catch (e) {
            console.error(e);
            alert("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleContinueAfterPin = () => {
        if (eventId) {
            replace("Join", { id: eventId });
        }
    };

    return (
        <div className="space-y-6">
            {generatedPin ? (
                <div className="text-center space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-sm text-green-800 mb-1">게스트 계정이 생성되었습니다!</p>
                        <p className="text-xs text-green-600 mb-4">나중에 다시 입장하려면 아래 코드를 사용하세요.</p>
                        <div className="text-3xl font-mono font-bold text-green-900 tracking-wider">
                            {generatedPin}
                        </div>
                    </div>
                    <Button className="w-full" onClick={handleContinueAfterPin}>
                        일정 확인하러 가기
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex space-x-4 text-sm border-b border-gray-200">
                        <button
                            className={`pb-2 border-b-2 transition-colors ${guestMode === "new" ? "border-black text-black font-medium" : "border-transparent text-gray-500"}`}
                            onClick={() => setGuestMode("new")}
                        >
                            처음 방문해요
                        </button>
                        <button
                            className={`pb-2 border-b-2 transition-colors ${guestMode === "existing" ? "border-black text-black font-medium" : "border-transparent text-gray-500"}`}
                            onClick={() => setGuestMode("existing")}
                        >
                            입장 코드가 있어요
                        </button>
                    </div>

                    {guestMode === "new" ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="guestName">이름</Label>
                                <Input
                                    id="guestName"
                                    placeholder="이름을 입력하세요"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleGuestCreate}
                                disabled={loading || !guestName.trim()}
                            >
                                {loading ? "생성 중..." : "게스트로 시작하기"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="guestPin">입장 코드 (6자리)</Label>
                                <Input
                                    id="guestPin"
                                    placeholder="123456"
                                    maxLength={6}
                                    value={guestPin}
                                    onChange={(e) => setGuestPin(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleGuestLogin}
                                disabled={loading || guestPin.length !== 6}
                            >
                                {loading ? "확인 중..." : "입장하기"}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
