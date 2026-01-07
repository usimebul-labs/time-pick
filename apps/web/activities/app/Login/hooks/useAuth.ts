import { useState } from "react";
import { createBrowserClient } from "@repo/database";
import { useFlow } from "@stackflow/react/future";
import { useStackReset } from "@/common/hooks/useStackReset";

interface UseAuthParams {
    next?: string;
}

export const useAuth = ({ next }: UseAuthParams = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationSent, setConfirmationSent] = useState(false);
    const [lastEmail, setLastEmail] = useState("");

    const supabase = createBrowserClient();
    const { replace } = useFlow();
    const { resetToDashboard } = useStackReset();

    const getRedirectUrl = () => {
        const origin = window.location.origin;
        const nextParam = next ? `?next=${next}` : '';
        return `${origin}/api/auth/callback${nextParam}`;
    };

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: getRedirectUrl(),
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Error logging in with Google:", error);
            setError(error.message || "Google 로그인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        setLastEmail(email);
        setConfirmationSent(false);

        try {
            // 1. Try Login with Password
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!loginError && loginData.session) {
                if (next) location.href = next
                else {
                    resetToDashboard();
                }
                return;
            }

            // 2. If it's an "Invalid login credentials" error, try Signing Up
            if (loginError && loginError.message === "Invalid login credentials") {
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: getRedirectUrl(),
                    }
                });

                if (signupError) {
                    if (signupError.message === "User already registered") {
                        setError("비밀번호가 올바르지 않습니다.");
                    } else {
                        setError(signupError.message);
                    }
                    return;
                }

                // Signup Success
                if (signupData.session) {
                    if (next) location.href = next
                    else {
                        resetToDashboard();
                    }
                } else if (signupData.user) {
                    setConfirmationSent(true);
                }
            } else if (loginError) {
                setError(loginError.message);
            }
        } catch (e: any) {
            setError(e.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const resendSignupEmail = async () => {
        if (!lastEmail) return;
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: lastEmail,
                options: {
                    emailRedirectTo: getRedirectUrl(),
                }
            });
            if (error) {
                setError(error.message);
            } else {
                alert("인증 메일을 재전송했습니다.");
            }
        } catch (e: any) {
            setError(e.message || "재전송 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        confirmationSent,
        lastEmail,
        loginWithGoogle,
        loginWithEmail,
        resendSignupEmail,
        resetState: () => { setError(null); setConfirmationSent(false); }
    };
};
