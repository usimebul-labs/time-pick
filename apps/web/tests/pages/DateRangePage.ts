import { Page, Locator, expect } from '@playwright/test';

export class DateRangePage {
    private readonly activity: Locator;
    private readonly notToDefineCheckbox: Locator;
    private readonly startDateInput: Locator;
    private readonly endDateInput: Locator;
    private readonly nextButton: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');
        this.notToDefineCheckbox = this.activity.getByText('아직 잘 모르겠어요');
        this.startDateInput = this.activity.locator('div:has(label:has-text("이날부터")) input[type="date"]');
        this.endDateInput = this.activity.locator('div:has(label:has-text("이날까지")) input[type="date"]');
        this.nextButton = this.activity.getByRole('button', { name: '다음' });
    }

    async toggleUndefined() {
        await expect(this.notToDefineCheckbox).toBeEnabled();
        await this.notToDefineCheckbox.click();
    }

    async selectDateRange(weeksFromNow: number = 2) {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + (weeksFromNow * 7));

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const endDateStr = formatDate(futureDate);

        await expect(this.endDateInput).toBeVisible();
        await this.endDateInput.fill(endDateStr);
        await this.endDateInput.press('Tab');

        await expect(this.page.locator('.animate-spin')).not.toBeVisible();
    }

    async goNext() {
        await expect(this.nextButton).toBeEnabled();
        await this.nextButton.click();
    }
}
