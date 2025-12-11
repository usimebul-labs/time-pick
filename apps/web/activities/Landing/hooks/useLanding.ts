import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useFlow } from "../../../stackflow";

export const useLanding = () => {
    const [user, setUser] = useState<User | null>(null);
    const { push } = useFlow();
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const handleLoginClick = () => {
        push("Login", {});
    };

    const handleLogoutClick = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const handleDashboardClick = () => {
        push("Dashboard", {});
    };

    const handleStartClick = () => {
        push("Login", { next: "/app/calendar/new" });
    };

    return {
        user,
        handleLoginClick,
        handleDashboardClick,
        handleStartClick,
        handleLogoutClick,
    };
};
