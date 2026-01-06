import { createBrowserClient } from "@repo/database";
import { useFlow } from "../../../stackflow";

export const useLandingAuth = () => {
    const { push } = useFlow();
    const supabase = createBrowserClient();

    const handleLoginClick = () => {
        push("Login", { next: "/app/dashboard" });
    };

    const handleLogoutClick = async () => {
        await supabase.auth.signOut();
    };

    return {
        handleLoginClick,
        handleLogoutClick,
    };
};
