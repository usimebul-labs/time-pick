import { createClient } from "@/common/lib/supabase/client";
import { useFlow } from "@stackflow/react/future";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";


export function useDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const { push } = useFlow();
    const supabase = createClient();

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        init();
    }, []);


    const handleCreateSchedule = () => {
        push("CreateBasicInfo", {});
    };


    return {
        user,
        handleCreateSchedule
    };
}
