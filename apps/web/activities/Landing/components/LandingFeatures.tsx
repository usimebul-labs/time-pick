import { FeatureCard, Section } from "@repo/ui";
import { Calendar, Clock, Share2, Users } from "lucide-react";

export const LandingFeatures = () => {
    return (
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
    );
};
