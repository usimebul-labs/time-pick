import { Section } from "@repo/ui";

export const LandingStats = () => {
    return (
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
    );
};
