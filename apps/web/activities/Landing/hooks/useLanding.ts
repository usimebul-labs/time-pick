import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useFlow } from "../../../stackflow";

export const useLanding = () => {
    const [user, setUser] = useState<any>(null);
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

    const handleDashboardClick = () => {
        push("Dashboard", {});
    };

    const handleStartClick = () => {
        if (user) {
            push("Dashboard", {});
        } else {
            push("Login", {});
        }
    };

    const handleLogoutClick = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return {
        user,
        handleLoginClick,
        handleDashboardClick,
        handleStartClick,
        handleLogoutClick,
    };
};
