import { Button, Section } from "@repo/ui";
import { ArrowRight } from "lucide-react";

interface LandingCTAProps {
    onStartClick: () => void;
}

export const LandingCTA = ({ onStartClick }: LandingCTAProps) => {
    return (
        <Section className="bg-primary text-primary-foreground">
            <div className="flex flex-col items-center text-center space-y-6">
                <h2 className="text-3xl font-bold break-keep">지금 바로 시작해보세요</h2>
                <p className="text-primary-foreground/80 max-w-[600px] text-lg break-keep">
                    타임픽과 함께라면 일정 조율이 더 이상 스트레스가 아닙니다.<br />
                    지금 가입하고 효율적인 시간 관리를 경험하세요.
                </p>
                <Button size="lg" variant="secondary" className="mt-4 font-bold px-8 h-12 text-md" onClick={onStartClick}>
                    30초 만에 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </Section>
    );
};
