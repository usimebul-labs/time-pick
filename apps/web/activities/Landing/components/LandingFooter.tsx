export const LandingFooter = () => {
    return (
        <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-muted/20">
            <p className="text-xs text-muted-foreground">
                © 2025 TimePick. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <div className="text-xs hover:underline underline-offset-4 text-muted-foreground cursor-pointer">
                    서비스 이용약관
                </div>
                <div className="text-xs hover:underline underline-offset-4 text-muted-foreground cursor-pointer">
                    개인정보 처리방침
                </div>
                <div className="text-xs hover:underline underline-offset-4 text-muted-foreground cursor-pointer">
                    문의하기
                </div>
            </nav>
        </footer>
    );
};
