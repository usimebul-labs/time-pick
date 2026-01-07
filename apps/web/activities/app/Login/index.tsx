import { ActivityLayout } from "@/common/components/ActivityLayout";
import { SocialLoginButton } from "@repo/ui";
import { useAuth } from "./hooks/useAuth";
import { EmailLoginForm } from "./components/EmailLoginForm";

export default function Login({ params: { next } }: { params: { next?: string } }) {
    const { loading, loginWithGoogle } = useAuth({ next });

    return (
        <ActivityLayout hideAppBar>
            <div className="flex flex-col flex-1 bg-white">
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-[360px]">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">TimePick</h1>
                            <p className="mt-2 text-slate-600">간편하게 일정을 조율해보세요</p>
                        </div>

                        <EmailLoginForm next={next} />

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-2 bg-white text-slate-400">Social Login</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SocialLoginButton provider="google" onClick={loginWithGoogle} disabled={loading}>
                                {loading ? "연결 중..." : "Google로 계속하기"}
                            </SocialLoginButton>
                        </div>
                    </div>
                </div>
            </div>
        </ActivityLayout>
    );
}
