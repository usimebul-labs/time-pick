import { Button } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { useLandingAuth } from "../hooks/useLandingAuth";

interface LandingHeaderProps {
    user: User | null;
}

export const LandingHeader = ({ user }: LandingHeaderProps) => {
    const { handleLoginClick, handleLogoutClick } = useLandingAuth();
    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "사용자";

    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center justify-center font-bold text-xl tracking-tight text-slate-900 cursor-pointer">
                TimePick
            </div>
            <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                {user ?
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700">안녕하세요 {displayName}님</span>
                        <Button variant="outline" size="sm" onClick={handleLogoutClick}>로그아웃</Button>
                    </div> :
                    <Button variant="default" size="sm" onClick={handleLoginClick}>로그인</Button>
                }
            </nav>
        </header>
    );
};
