import { Button, Section } from "@repo/ui";
import { User } from "@supabase/supabase-js";
import { useLandingActions } from "../hooks/useLandingActions";

interface LandingHeroProps {
    user: User | null;
}

export const LandingHero = ({ user }: LandingHeroProps) => {
    const { handleStartClick, handleDashboardClick } = useLandingActions();

    return (
        <main className="flex-1">
            <Section className="pt-20 md:pt-32 pb-16 md:pb-24">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="space-y-4 max-w-3xl lg:max-w-5xl">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl/none break-keep">
                            일정 조율, 이제 고민하지 마세요
                        </h1>
                        <p className="mx-auto max-w-[700px] lg:max-w-4xl text-slate-600 text-sm sm:text-base md:text-xl leading-relaxed">
                            <span className="break-keep">
                                수십 번 오가는 이메일과 메시지 없이, <br className="inline md:hidden" />링크 하나로 완벽한 미팅 시간을 정해보세요.
                            </span>
                        </p>
                    </div>

                    <div className="space-x-4">
                        {user ?
                            <Button size="xl" onClick={handleDashboardClick}>대시보드로 이동</Button> :
                            <Button size="xl" onClick={handleStartClick}>시작하기</Button>
                        }
                    </div>

                    <div className="w-full max-w-5xl overflow-hidden rounded-xl border bg-muted/50 shadow-xl lg:mt-20">
                        <div className="aspect-video flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                            <span className="text-lg">Product Demo Image Placeholder</span>
                        </div>
                    </div>
                </div>
            </Section >
        </main>


    );
};
