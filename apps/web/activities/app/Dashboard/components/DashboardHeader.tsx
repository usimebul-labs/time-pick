import { supabase } from "@/lib/supabase";
import { Button } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
    user: User | null;
    onCreateSchedule: () => void;
}

export function DashboardHeader({ user, onCreateSchedule }: DashboardHeaderProps) {
    const getUserName = (user: User | null) => {
        if (!user) return "게스트";
        const meta = user.user_metadata;
        if (meta?.full_name) return meta.full_name;
        if (meta?.name) return meta.name;
        if (user.email) return user.email.split("@")[0];
        return "사용자";
    };

    const userName = getUserName(user);

    const handleLogoutClick = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="bg-white/80 sticky top-0 z-10 backdrop-blur-md border-b border-slate-200">
            <div className="p-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <p className="text-slate-500 text-sm font-medium mb-0.5">반가워요 👋</p>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{userName}님</h1>
                    </div>
                    <Button variant="ghost" size="sm"
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-medium h-auto py-2 px-4 rounded-full"
                        onClick={handleLogoutClick}>로그아웃</Button>
                </div>

                <Button
                    size="xl"
                    className="w-full font-bold shadow-sm rounded-xl"
                    onClick={onCreateSchedule}
                >
                    <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} /> 새 일정 만들기
                </Button>
            </div>
        </div>
    );
}
