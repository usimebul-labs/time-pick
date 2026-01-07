import { useFlow } from "@/stackflow";
import { useStack } from "@stackflow/react";

export const useStackReset = () => {
    const { pop, replace } = useFlow();
    const stack = useStack();

    const resetToDashboard = () => {
        // findLastIndex is not available in all envs or config, so use reverse find
        const activities = [...stack.activities];
        const lastDashboardIndex = activities.map(a => a.name).lastIndexOf("Dashboard");

        if (lastDashboardIndex !== -1) {
            // Dashboard is in the stack
            const popCount = stack.activities.length - 1 - lastDashboardIndex;
            if (popCount > 0) {
                // Loop pop to go back to Dashboard
                for (let i = 0; i < popCount; i++) {
                    pop();
                }
            }
        } else {
            // Dashboard is not in the stack, replace current with Dashboard
            replace("Dashboard", {}, { animate: false });
        }
    };

    return { resetToDashboard };
};
