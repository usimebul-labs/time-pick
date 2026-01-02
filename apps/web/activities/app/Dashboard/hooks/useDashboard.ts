import { useLoginedUser } from "@/common/hooks/useLoginedUser";
import { useFlow } from "@stackflow/react/future";


export function useDashboard() {
    const { user } = useLoginedUser();
    const { push } = useFlow();


    const handleCreateSchedule = () => {
        push("CreateBasicInfo", {});
    };


    return {
        user,
        handleCreateSchedule
    };
}
