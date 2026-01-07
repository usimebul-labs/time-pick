import { useFlow } from "@/stackflow";
import { useStackReset } from "@/common/hooks/useStackReset";

export const useLandingActions = () => {
    const { push } = useFlow();
    const { resetToDashboard } = useStackReset();

    const handleDashboardClick = () => {
        resetToDashboard();
    };

    const handleStartClick = () => {
        push("Login", { next: "/app/calendar/new" });
    };

    return {
        handleDashboardClick,
        handleStartClick,
    };
};
