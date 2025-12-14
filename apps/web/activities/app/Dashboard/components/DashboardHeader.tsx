import { Avatar, AvatarFallback, AvatarImage, Button } from "@repo/ui";
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

    const getUserAvatar = (user: User | null) => {
        if (!user) return "";
        return user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
    };

    const userName = getUserName(user);
    const userAvatarUrl = getUserAvatar(user);

    return (
        <div className="bg-white/80 sticky top-0 z-10 backdrop-blur-md border-b border-gray-100">
            <div className="p-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <p className="text-gray-500 text-sm font-medium mb-0.5">반가워요 👋</p>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{userName}님</h1>
                    </div>
                    <Avatar className="h-10 w-10 ring-2 ring-gray-100 p-0.5">
                        <AvatarImage src={userAvatarUrl} alt={userName} className="rounded-full" />
                        <AvatarFallback className="text-sm bg-indigo-50 text-indigo-600">
                            {userName.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <Button
                    className="w-full h-12 text-[15px] font-semibold shadow-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 hover:shadow-md transition-all active:scale-[0.98]"
                    onClick={onCreateSchedule}
                >
                    <Plus className="mr-2 h-5 w-5" /> 새 일정 만들기
                </Button>
            </div>
        </div>
    );
}
