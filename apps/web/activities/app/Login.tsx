import { AppScreen } from "@stackflow/plugin-basic-ui";
import { SocialLoginButton } from "@repo/ui";
import { createClient } from "../../lib/supabase/client";
import { useState } from "react";

type LoginProps = {};

export default function Login({ }: LoginProps) {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error logging in:", error);
            alert("로그인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppScreen>
            <div className="flex flex-col flex-1 bg-white">
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-sm space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">TimePick</h1>
                            <p className="mt-2 text-gray-600">간편하게 일정을 조율해보세요</p>
                        </div>

                        <div className="space-y-4">
                            <SocialLoginButton provider="google" onClick={handleGoogleLogin} disabled={loading}>
                                {loading ? "연결 중..." : "Google로 계속하기"}
                            </SocialLoginButton>
                            {/* Future expansion: Kakao login */}
                        </div>
                    </div>
                </div>
            </div>
        </AppScreen>
    );
}
