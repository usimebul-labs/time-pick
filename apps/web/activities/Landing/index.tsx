import { ActivityLayout } from "@/common/components/ActivityLayout";
import { ActivityComponentType } from "@stackflow/react";
import { LandingFooter } from "./components/LandingFooter";
import { LandingHeader } from "./components/LandingHeader";
import { LandingHero } from "./components/LandingHero";
import { useLoginedUser } from "../../common/hooks/useLoginedUser";

const Landing: ActivityComponentType = () => {
    const { user } = useLoginedUser();

    return (
        <ActivityLayout hideAppBar>
            <div className="flex flex-col min-h-screen bg-background text-foreground overflow-y-auto">
                <LandingHeader user={user} />
                <LandingHero user={user} />
                <LandingFooter />
            </div>
        </ActivityLayout>
    );
};

export default Landing;
