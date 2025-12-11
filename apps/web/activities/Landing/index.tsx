import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { LandingFooter } from "./components/LandingFooter";
import { LandingHeader } from "./components/LandingHeader";
import { LandingHero } from "./components/LandingHero";
import { useLanding } from "./hooks/useLanding";

const Landing: ActivityComponentType = () => {
    const { user, handleLoginClick, handleDashboardClick, handleStartClick, handleLogoutClick } = useLanding();

    return (
        <AppScreen>
            <div className="flex flex-col min-h-screen bg-background text-foreground overflow-y-auto">
                <LandingHeader
                    user={user}
                    onLoginClick={handleLoginClick}
                    onLogoutClick={handleLogoutClick}
                />

                <main className="flex-1">
                    <LandingHero user={user} onStartClick={handleStartClick} onDashboardClick={handleDashboardClick} />
                </main>
                <LandingFooter />
            </div>
        </AppScreen>
    );
};

export default Landing;
