import { useActionState, useEffect, useState } from "react";
import { useFlow } from "../../../../../stackflow";
import { createCalendar, CreateCalendarState } from "@/app/actions/calendar";
import { CreateCalendarData } from "../types";

const initialState: CreateCalendarState = { message: "", error: "" };

// Helper: Get Today and End of Month
const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const getTodayStr = () => formatDate(new Date());
const getLastDayOfMonthStr = () => {
    const d = new Date();
    return formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
};

export const useCreate = () => {
    const { pop, replace } = useFlow();
    const [state, formAction] = useActionState(createCalendar, initialState);
    const [showShareDialog, setShowShareDialog] = useState(false);

    // Initial Data
    const [data, setData] = useState<CreateCalendarData>({
        title: "",
        description: "",
        scheduleType: "date", // Default Monthly
        startDate: getTodayStr(),
        endDate: getLastDayOfMonthStr(),
        startHour: 9,
        endHour: 18,
        enabledDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        excludedDates: [],
        deadline: `${getLastDayOfMonthStr()}T23:59`, // Default deadline
    });

    const updateData = (updates: Partial<CreateCalendarData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    // Wizard Step State
    const [currentStep, setCurrentStep] = useState(1);
    const TOTAL_STEPS = 5;

    // Navigation Handlers
    const nextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            // Validation
            if (currentStep === 1 && !data.title) {
                alert("일정 제목을 입력해주세요.");
                return;
            }
            if (currentStep === 3 && (!data.startDate || !data.endDate)) {
                alert("시작일과 종료일을 설정해주세요.");
                return;
            }
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            pop();
        }
    };

    // Effect for Submission Success
    useEffect(() => {
        if (state.message === "Success" && state.eventId) {
            setShowShareDialog(true);
        } else if (state.error) {
            alert(state.error);
        }
    }, [state]);

    const handleShareClose = () => {
        setShowShareDialog(false);
        if (state.eventId) {
            replace("Join", { id: state.eventId });
        }
    };

    // Auto-update defaults when Type changes
    useEffect(() => {
        if (data.scheduleType === "datetime") {
            // Weekly Defaults: Today to End of Week (Saturday)
            const d = new Date();
            const day = d.getDay();
            const diff = 6 - day; // Saturday
            const nextSat = new Date();
            nextSat.setDate(d.getDate() + diff);

            // If we just switched and user hasn't manually set dates (hard to track "manual"),
            // but let's just update endDate if it looks like the monthly default
            // or just update it for convenience as User Requirement said "Default: This Week"
            updateData({ endDate: formatDate(nextSat) });

            // Update deadline too if linked
            // Actually let's not override aggressively if user set it.
            // But for MVP wizard flow, resetting to sensible defaults on Type Change is usually expected.
        } else {
            // Monthly Defaults: Today to End of Month
            updateData({ endDate: getLastDayOfMonthStr() });
        }
    }, [data.scheduleType]);

    return {
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
        eventId: state.eventId,
    };
};
