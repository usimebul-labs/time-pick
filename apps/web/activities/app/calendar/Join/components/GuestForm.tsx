import { Button, Input, Label } from "@repo/ui";
import { ArrowRight } from "lucide-react";
import { useGuestForm } from "../hooks/useGuestForm";

interface GuestFormProps {
    id: string;
}

export function GuestForm({ id }: GuestFormProps) {
    const { name, setName, loading, handleSubmit, handleLoginRedirect } = useGuestForm(id);

    return (
        <div className="w-full">
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
                    이미 계정이 있으신가요? <span className="underline cursor-pointer" onClick={handleLoginRedirect}>로그인하기</span>
                </p>
            </div>
        </div>
    );
}
