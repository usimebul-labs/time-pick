"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/common/lib/supabase";

interface UserMenuProps {
    user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const getUserName = (user: User | null) => {
        if (!user) return "게스트";
        const meta = user.user_metadata;
        if (meta?.full_name) return meta.full_name;
        if (meta?.name) return meta.name;
        if (user.email) return user.email.split("@")[0];
        return "사용자";
    };

    const userName = getUserName(user);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none flex items-center gap-1 group">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                    {userName}님
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
