import { createClient } from "@/common/lib/supabase/client";
import { useFlow } from "../../../stackflow";

export const useLandingAuth = () => {
    const { push } = useFlow();
    const supabase = createClient();

    const handleLoginClick = () => {
        push("Login", {});
    };

    const handleLogoutClick = async () => {
        await supabase.auth.signOut();
    };

    return {
        handleLoginClick,
        handleLogoutClick,
    };
};
