import { Button } from "@repo/ui";

interface LandingHeaderProps {
    user: any;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onDashboardClick: () => void;
}

export const LandingHeader = ({ user, onLoginClick, onLogoutClick, onDashboardClick }: LandingHeaderProps) => {
    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "사용자";

    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center justify-center font-bold text-xl tracking-tight cursor-pointer">
                TimePick
            </div>
            <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">
                            {displayName}님 안녕하세요
                        </span>
                        <Button variant="outline" size="sm" onClick={onLogoutClick}>
                            로그아웃
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" onClick={onLoginClick}>
                        로그인
                    </div>
                )}
            </nav>
        </header>
    );
};
