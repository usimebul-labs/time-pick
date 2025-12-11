import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { useLanding } from "./hooks/useLanding";
import { LandingHeader } from "./components/LandingHeader";
import { LandingHero } from "./components/LandingHero";
import { LandingStats } from "./components/LandingStats";
import { LandingFeatures } from "./components/LandingFeatures";
import { LandingCTA } from "./components/LandingCTA";
import { LandingFooter } from "./components/LandingFooter";

const Landing: ActivityComponentType = () => {
    const { user, handleLoginClick, handleDashboardClick, handleStartClick, handleLogoutClick } = useLanding();

    return (
        <AppScreen>
            <div className="flex flex-col min-h-screen bg-background text-foreground overflow-y-auto">
                <LandingHeader
                    user={user}
                    onLoginClick={handleLoginClick}
                    onDashboardClick={handleDashboardClick}
                    onLogoutClick={handleLogoutClick}
                />

                <main className="flex-1">
                    <LandingHero user={user} />
                    {/* <LandingStats /> */}
                    <LandingFeatures />
                    <LandingCTA onStartClick={handleStartClick} />
                </main>

                <LandingFooter />
            </div>
        </AppScreen>
    );
};

export default Landing;
