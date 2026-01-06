import { useState } from "react";
import { z } from "zod";
import { useEmailAuth } from "../hooks/useEmailAuth";
import { Loader2 } from "lucide-react";

const emailSchema = z.string().email("이메일 형식이 올바르지 않습니다.");
const passwordSchema = z.string().min(6, "비밀번호는 6자 이상이어야 합니다.");

interface EmailLoginFormProps {
    next?: string;
}

export function EmailLoginForm({ next }: EmailLoginFormProps) {
    const { loading, error, confirmationSent, lastEmail, handleLoginOrSignup, handleResend } = useEmailAuth({ next });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);



        // Zod Validation
        const emailResult = emailSchema.safeParse(email);
        if (!emailResult.success) {
            setValidationError(emailResult.error.issues[0]?.message || "Invalid email");
            return;
        }

        const passwordResult = passwordSchema.safeParse(password);
        if (!passwordResult.success) {
            setValidationError(passwordResult.error.issues[0]?.message || "Invalid password");
            return;
        }

        await handleLoginOrSignup(email, password);
    };

    if (confirmationSent) {
        return (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="p-6 bg-blue-50/50 text-blue-900 rounded-2xl text-sm border border-blue-100">
                    <p className="font-semibold text-lg mb-2">메일함을 확인해주세요</p>
                    <p className="text-blue-700 mb-1"><strong>{lastEmail}</strong>로 인증 메일을 보냈습니다.</p>
                    <p className="text-blue-600/80 text-xs">메일함에서 인증 링크를 클릭하여 가입을 완료해주세요.</p>
                </div>
                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-sm text-slate-500 hover:text-slate-800 underline disabled:opacity-50 transition-colors"
                >
                    {loading ? "전송 중..." : "인증 메일이 오지 않았나요? 재전송"}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-3">
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50 transition-all placeholder:text-slate-400 text-sm"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50 transition-all placeholder:text-slate-400 text-sm"
                    disabled={loading}
                />
            </div>

            {(validationError || error) && (
                <div className="text-sm text-red-500 text-center animate-in slide-in-from-top-1 fade-in">
                    {validationError || error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center transition-all shadow-lg shadow-slate-900/10"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "이메일로 계속하기"}
            </button>
        </form>
    );
}
