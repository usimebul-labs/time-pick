import { useState } from "react";
import { createBrowserClient } from "@repo/database";
import { useRouter } from "next/navigation";
import { useFlow } from "@stackflow/react/future";

interface UseEmailAuthParams {
    next?: string;
}

export const useEmailAuth = ({ next }: UseEmailAuthParams = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationSent, setConfirmationSent] = useState(false);
    const [lastEmail, setLastEmail] = useState("");

    const supabase = createBrowserClient();
    const { replace } = useFlow();

    const handleLoginOrSignup = async (email: string, password: string) => {
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
                // Login Success
                replace("Dashboard", {});
                return;
            }

            // 2. If it's an "Invalid login credentials" error, try Signing Up
            // This covers the case where the user doesn't exist yet.
            if (loginError && loginError.message === "Invalid login credentials") {
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/api/auth/callback${next ? `?next=${next}` : ''}`,
                    }
                });

                if (signupError) {
                    if (signupError.message === "User already registered") {
                        // User exists but password was incorrect (since login failed)
                        setError("비밀번호가 올바르지 않습니다.");
                    } else {
                        setError(signupError.message);
                    }
                    return;
                }

                console.log(signupData)

                // Signup Success
                if (signupData.session) {
                    // Auto Logged In (Email confirmation not required setting)
                    replace("Dashboard", {});
                } else if (signupData.user) {
                    // Confirmation email sent
                    setConfirmationSent(true);
                }
            } else if (loginError) {
                // Other login errors
                setError(loginError.message);
            }
        } catch (e: any) {
            setError(e.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!lastEmail) return;
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: lastEmail,
                options: {
                    emailRedirectTo: `${window.location.origin}/api/auth/callback${next ? `?next=${next}` : ''}`,
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
        handleLoginOrSignup,
        handleResend,
        resetState: () => { setError(null); setConfirmationSent(false); }
    };
};
