import { Section } from "@repo/ui";
import Image from "next/image";

const DEMO_STEPS = [
    {
        title: "일정 생성",
        description: "모임, 회식, 스터디... 어떤 모임이든 빠르게 일정을 만들어보세요.",
        image: "/landing/landing_step_create.png",
    },
    {
        title: "시간 선택",
        description: "참여자들에게 링크를 공유하면, 각자 가능한 시간을 편하게 선택할 수 있어요.",
        image: "/landing/landing_step_input.png",
    },
    {
        title: "일정 확정",
        description: "모두가 가능한 시간을 한눈에 확인하고, 최적의 시간을 확정하세요.",
        image: "/landing/landing_step_confirm.png",
    },
];

export const LandingDemo = () => {
    return (
        <Section className="py-16 md:py-24 bg-slate-50">
            <div className="flex flex-col items-center text-center space-y-12">
                <div className="space-y-4 max-w-3xl px-4">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl break-keep">
                        복잡한 일정 조율, 3단계로 끝
                    </h2>
                    <p className="text-slate-600 text-lg break-keep">
                        방장도 참여자도 모두가 편한 일정 관리 경험을 제공합니다.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 pb-8 md:justify-center md:overflow-visible md:snap-none md:grid md:grid-cols-3 md:gap-8 max-w-7xl no-scrollbar">
                    {DEMO_STEPS.map((step, index) => (
                        <div key={index} className="snap-center shrink-0 w-[80vw] max-w-[320px] flex flex-col items-center space-y-8">
                            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border-[8px] border-slate-900 bg-slate-100 shadow-2xl ring-1 ring-slate-900/10">
                                {/* iPhone Dynamic Island / Notch styling */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-slate-900 rounded-b-2xl z-20"></div>
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 80vw, 320px"
                                />
                            </div>
                            <div className="space-y-3 px-2">
                                <div className="flex items-center justify-center space-x-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                                </div>
                                <p className="text-slate-600 break-keep leading-relaxed text-base">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
