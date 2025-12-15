import { useFlow } from "../../../stackflow";

export const useLandingActions = () => {
    const { push } = useFlow();

    const handleDashboardClick = () => {
        push("Dashboard", {});
    };

    const handleStartClick = () => {
        push("Login", { next: "/app/calendar/new" });
    };

    return {
        handleDashboardClick,
        handleStartClick,
    };
};
