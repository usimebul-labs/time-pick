import { useState } from "react";
import { createBrowserClient } from "@repo/database";

interface UseLoginParams {
    next?: string;
}

export const useLogin = ({ next }: UseLoginParams = {}) => {
    const [loading, setLoading] = useState(false);
    const supabase = createBrowserClient();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback${next ? `?next=${next}` : ''}`,
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

    return {
        loading,
        handleGoogleLogin,
    };
};
