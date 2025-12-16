import { AppScreen } from "@stackflow/plugin-basic-ui";
import { SocialLoginButton } from "@repo/ui";
import { useLogin } from "./hooks/useLogin";

export default function Login({ params: { next } }: { params: { next?: string } }) {
    const { loading, handleGoogleLogin } = useLogin({ next });

    return (
        <AppScreen>
            <div className="flex flex-col flex-1 bg-white">
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-sm space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">TimePick</h1>
                            <p className="mt-2 text-slate-600">간편하게 일정을 조율해보세요</p>
                        </div>

                        <div className="space-y-4">
                            <SocialLoginButton provider="google" onClick={handleGoogleLogin} disabled={loading}>
                                {loading ? "연결 중..." : "Google로 계속하기"}
                            </SocialLoginButton>
                        </div>
                    </div>
                </div>
            </div>
        </AppScreen>
    );
}
