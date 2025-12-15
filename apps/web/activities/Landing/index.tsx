import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { LandingFooter } from "./components/LandingFooter";
import { LandingHeader } from "./components/LandingHeader";
import { LandingHero } from "./components/LandingHero";
import { useLandingUser } from "./hooks/useLandingUser";

const Landing: ActivityComponentType = () => {
    const { user } = useLandingUser();

    return (
        <AppScreen>
            <div className="flex flex-col min-h-screen bg-background text-foreground overflow-y-auto">
                <LandingHeader user={user} />
                <LandingHero user={user} />


                <LandingFooter />
            </div>
        </AppScreen>
    );
};

export default Landing;
