import { Button, Section } from "@repo/ui";


import { User } from "@supabase/supabase-js";

interface LandingHeroProps {
    user: User | null;
    onStartClick: () => void;
    onDashboardClick: () => void;
}

export const LandingHero = ({ user, onStartClick, onDashboardClick }: LandingHeroProps) => {
    return (
        <Section className="pt-20 md:pt-32 pb-16 md:pb-24">
            <div className="flex flex-col items-center text-center space-y-8">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl/none">
                        일정 조율, 이제 고민하지 마세요
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl">
                        <span className="break-keep">
                            수십 번 오가는 이메일과 메시지 없이, <br className="hidden md:inline" />
                            링크 하나로 완벽한 미팅 시간을 정해보세요.
                        </span>
                    </p>
                </div>

                <div className="w-full max-w-5xl mt-12 overflow-hidden rounded-xl border bg-muted/50 shadow-xl lg:mt-20">
                    <div className="aspect-video flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                        <span className="text-lg">Product Demo Image Placeholder</span>
                    </div>
                </div>

                <div className="space-x-4">
                    {user ?
                        <Button size="lg" className="h-12 px-8 text-base" onClick={onDashboardClick}>대시보드로 이동</Button> :
                        <Button size="lg" className="h-12 px-8 text-base" onClick={onStartClick}>시작하기</Button>}
                </div>
            </div>
        </Section >

    );
};
