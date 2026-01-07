import { test as base } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';

// Page Object 타입 정의
type MyFixtures = {
    landingPage: LandingPage;
    loginPage: LoginPage;
};

// Fixture 확장
export const test = base.extend<MyFixtures>({
    landingPage: async ({ page }, use) => {
        await use(new LandingPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});

export { expect } from '@playwright/test';