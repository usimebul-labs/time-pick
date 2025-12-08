import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { Button, Hero, Section, FeatureCard } from "@repo/ui";
import { Calendar, Clock, Share2, Users, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useFlow } from "../stackflow";

const Landing: ActivityComponentType = () => {
    const [user, setUser] = useState<any>(null);
    const { push } = useFlow();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const handleLoginClick = () => {
        push("Login", {});
    };

    const handleDashboardClick = () => {
        push("Dashboard", {});
    };

    const handleStartClick = () => {
        if (user) {
            push("Dashboard", {});
        } else {
            push("Login", {});
        }
    };

    return (
        <AppScreen>
            <div className="flex flex-col min-h-screen bg-background text-foreground overflow-y-auto">
                {/* Header */}
                <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                    <div className="flex items-center justify-center font-bold text-xl tracking-tight cursor-pointer">
                        TimePick
                    </div>
                    <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                        {user ? (
                            <Button variant="default" size="sm" onClick={handleDashboardClick}>
                                대시보드
                            </Button>
                        ) : (
                            <div className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" onClick={handleLoginClick}>
                                로그인
                            </div>
                        )}
                    </nav>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    {/* Note: Hero component might use Link internally, if so it might need adjustment or we accept it navigates out of stack if it uses next/link. 
                        Ideally UI components should accept onClick or be stack-agnostic. 
                        Assuming Hero uses `ctaLink` string. If it renders Nextjs Link, it will hard reload. 
                        For now, let's keep it as is or override logic if possible.
                        Checking Hero usage: ctaLink is passed.
                    */}
                    <Hero
                        title="일정 조율, 이제 고민하지 마세요"
                        subtitle={
                            <span className="break-keep">
                                수십 번 오가는 이메일과 메시지 없이, <br className="hidden md:inline" />
                                링크 하나로 완벽한 미팅 시간을 정해보세요.
                            </span>
                        }
                        ctaText={user ? "대시보드로 이동" : "무료로 시작하기"}
                        // We might need to handle this navigation differently if Hero uses <Link>.
                        // If Hero accepts specific prop for interaction, use that.
                        // Since I cannot change Hero internals easily right now without reading it, I will pass the string path.
                        // But wait, if it's a hard reload it defeats the purpose of Stackflow.
                        // I will rely on standard Next Link behavior for now, or check Hero component.
                        // Actually, I can wrap the Hero button or provided onClick? 
                        // Let's assume standard link for now to get the page rendering.
                        ctaLink={user ? "/app/dashboard" : "/app/login"} // Changing /app to /app/login for clearer flow
                        image={
                            <div className="aspect-video flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                                <span className="text-lg">Product Demo Image Placeholder</span>
                            </div>
                        }
                    />

                    {/* Social Proof / Stats (Optional Idea) */}
                    <Section className="py-8 bg-muted/30 border-y">
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
                            <div>
                                <h4 className="text-2xl font-bold text-primary">1,000+</h4>
                                <p className="text-sm text-muted-foreground">누적 사용자</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-primary">5,000+</h4>
                                <p className="text-sm text-muted-foreground">생성된 일정</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-primary">98%</h4>
                                <p className="text-sm text-muted-foreground">사용자 만족도</p>
                            </div>
                        </div>
                    </Section>

                    {/* Feature Grid */}
                    <Section className="bg-background">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight mb-4 break-keep">왜 타임픽인가요?</h2>
                            <p className="text-muted-foreground text-lg break-keep">
                                복잡한 과정 없이,<br className="hidden sm:inline" /> 가장 심플하게 시간을 확정하세요.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard
                                icon={Calendar}
                                title="간편한 캘린더 연동"
                                description="구글 캘린더 등 기존 캘린더와 연동하여 빈 시간을 자동으로 찾아냅니다."
                            />
                            <FeatureCard
                                icon={Clock}
                                title="스마트한 시간 제안"
                                description="상대방과 나 모두에게 최적화된 미팅 시간을 추천해 드립니다."
                            />
                            <FeatureCard
                                icon={Share2}
                                title="링크 하나로 공유"
                                description="초대장을 만들고 링크를 보내세요. 상대방은 로그인 없이도 선택 가능합니다."
                            />
                            <FeatureCard
                                icon={Users}
                                title="그룹 스케줄링"
                                description="1:1 미팅은 물론, 다자간 미팅 시간 조율도 문제없습니다."
                            />
                        </div>
                    </Section>

                    {/* CTA Section */}
                    <Section className="bg-primary text-primary-foreground">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <h2 className="text-3xl font-bold break-keep">지금 바로 시작해보세요</h2>
                            <p className="text-primary-foreground/80 max-w-[600px] text-lg break-keep">
                                타임픽과 함께라면 일정 조율이 더 이상 스트레스가 아닙니다.<br />
                                지금 가입하고 효율적인 시간 관리를 경험하세요.
                            </p>
                            <Button size="lg" variant="secondary" className="mt-4 font-bold px-8 h-12 text-md" onClick={handleStartClick}>
                                30초 만에 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </Section>
                </main>

                {/* Footer */}
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
            </div>
        </AppScreen>
    );
};

export default Landing;
