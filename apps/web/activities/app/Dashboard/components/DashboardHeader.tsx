import { User } from "@supabase/supabase-js";
import { AppBar } from "@/common/components/AppBar";
import { UserMenu } from "@/common/components/UserMenu";

interface DashboardHeaderProps {
    user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <div>
            <AppBar
                title="Time Pick"
                right={<UserMenu user={user} />}
            />
        </div>
    );
}
