import { test as base } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { BasicInfo } from '../pages/BasicInfo';
import { CalendarTypePage } from '../pages/CalendarTypePage';
import { DateRangePage } from '../pages/DateRangePage';
import { ExclusionsPage } from '../pages/ExclusionsPage';
import { DeadlinePage } from '../pages/DeadlinePage';
import { SelectPage } from '../pages/SelectPage';

// Page Object 타입 정의
type Fixtures = {
    landingPage: LandingPage;
    loginPage: LoginPage;
    basicInfo: BasicInfo;
    calendarTypePage: CalendarTypePage;
    dateRangePage: DateRangePage;
    exclusionsPage: ExclusionsPage;
    deadlinePage: DeadlinePage;
    selectPage: SelectPage;
};

// Fixture 확장
export const test = base.extend<Fixtures>({
    landingPage: async ({ page }, use) => {
        await use(new LandingPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    basicInfo: async ({ page }, use) => {
        await use(new BasicInfo(page));
    },
    calendarTypePage: async ({ page }, use) => {
        await use(new CalendarTypePage(page));
    },
    dateRangePage: async ({ page }, use) => {
        await use(new DateRangePage(page));
    },
    exclusionsPage: async ({ page }, use) => {
        await use(new ExclusionsPage(page));
    },
    deadlinePage: async ({ page }, use) => {
        await use(new DeadlinePage(page));
    },
    selectPage: async ({ page }, use) => {
        await use(new SelectPage(page));
    }
});

export { expect } from '@playwright/test';