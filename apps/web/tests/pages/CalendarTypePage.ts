import { Page, Locator, expect } from '@playwright/test';

export class CalendarTypePage {
    private readonly activity: Locator;
    private readonly monthlyRadio: Locator;
    private readonly weeklyRadio: Locator;
    private readonly nextButton: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');
        this.monthlyRadio = this.activity.getByText('월간 캘린더');
        this.weeklyRadio = this.activity.getByText('주간 캘린더');
        this.nextButton = this.activity.getByRole('button', { name: '다음' });
    }

    async selectMonthlyType() {
        await expect(this.monthlyRadio).toBeEnabled();
        await this.monthlyRadio.click();

        await expect(this.nextButton).toBeEnabled();
        await this.nextButton.click();
    }

    async selectWeeklyType() {
        await expect(this.weeklyRadio).toBeEnabled();
        await this.weeklyRadio.click();

        await expect(this.nextButton).toBeEnabled();
        await this.nextButton.click();
    }
}
