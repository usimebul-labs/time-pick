"use client";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Button, ShareCalendarDialog } from "@repo/ui";
import { ArrowRight, Check } from "lucide-react";

import Step1_BasicInfo from "./components/Step1_BasicInfo";
import Step2_CalendarType from "./components/Step2_CalendarType";
import Step3_DateRange from "./components/Step3_DateRange";
import Step4_Exclusions from "./components/Step4_Exclusions";
import Step5_Deadline from "./components/Step5_Deadline";
import { useCreate } from "./hooks/useCreate";

export default function Create() {
    const {
        data,
        updateData,
        currentStep,
        TOTAL_STEPS,
        nextStep,
        prevStep,
        formAction,
        state,
        showShareDialog,
        handleShareClose,
        eventId,
    } = useCreate();

    return (
        <AppScreen
            appBar={{
                title: "일정 만들기",
                backButton: {
                    ariaLabel: "뒤로 가기",
                    onClick: prevStep,
                },
            }}
        >
            <div className="flex flex-col h-full bg-gray-50">
                {/* Progress Bar */}
                <div className="bg-white px-4 pt-2 pb-0">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 mb-2 font-medium">
                        <span>기본 정보</span>
                        <span>유형</span>
                        <span>기간</span>
                        <span>제외</span>
                        <span>마감</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-24">
                    {currentStep === 1 && <Step1_BasicInfo data={data} updateData={updateData} />}
                    {currentStep === 2 && <Step2_CalendarType data={data} updateData={updateData} />}
                    {currentStep === 3 && <Step3_DateRange data={data} updateData={updateData} />}
                    {currentStep === 4 && <Step4_Exclusions data={data} updateData={updateData} />}
                    {currentStep === 5 && <Step5_Deadline data={data} updateData={updateData} />}
                </div>

                {/* Footer Navigation */}
                <div className="p-4 bg-white border-t safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 w-full fixed bottom-0 max-w-md mx-auto">
                    <div className="flex gap-3">
                        {currentStep < TOTAL_STEPS ? (
                            <Button size="lg" className="w-full text-base" onClick={nextStep}>
                                다음
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <form action={formAction} className="w-full">
                                {/* Hidden inputs to pass data to Server Action */}
                                <input type="hidden" name="title" value={data.title} />
                                <input type="hidden" name="description" value={data.description} />
                                <input type="hidden" name="scheduleType" value={data.scheduleType} />
                                <input type="hidden" name="startDate" value={data.startDate} />
                                <input type="hidden" name="endDate" value={data.endDate} />
                                <input type="hidden" name="startHour" value={data.startHour} />
                                <input type="hidden" name="endHour" value={data.endHour} />
                                <input type="hidden" name="enabledDays" value={JSON.stringify(data.enabledDays)} />
                                <input type="hidden" name="excludedDates" value={JSON.stringify(data.excludedDates)} />
                                {data.deadline && <input type="hidden" name="deadline" value={data.deadline} />}

                                <Button size="lg" type="submit" className="w-full text-base">
                                    <Check className="w-4 h-4 mr-2" />
                                    캘린더 만들기
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <ShareCalendarDialog
                isOpen={showShareDialog}
                onClose={handleShareClose}
                link={typeof window !== 'undefined' ? `${window.location.origin}/app/calendar/${eventId}` : ''}
            />
        </AppScreen>
    );
}
