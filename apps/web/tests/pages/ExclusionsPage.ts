import { Page, Locator, expect } from '@playwright/test';

export class ExclusionsPage {
    private readonly activity: Locator;
    private readonly holidayCheckbox: Locator;
    private readonly nextButton: Locator;
    private readonly dayButtons: Map<string, Locator>;
    private readonly everydayButton: Locator;
    private readonly weekdayButton: Locator;
    private readonly weekendButton: Locator;
    private readonly specificDateInput: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');
        this.holidayCheckbox = this.activity.getByText('공휴일은 쉴까요?');
        this.nextButton = this.activity.getByRole('button', { name: '다음' });

        this.dayButtons = new Map();
        ['일', '월', '화', '수', '목', '금', '토'].forEach(day => {
            this.dayButtons.set(day, this.activity.getByRole('button', { name: day, exact: true }));
        });

        this.everydayButton = this.activity.getByRole('button', { name: '매일' });
        this.weekdayButton = this.activity.getByRole('button', { name: '평일만' });
        this.weekendButton = this.activity.getByRole('button', { name: '주말만' });

        // Find input near the specific label
        this.specificDateInput = this.activity.locator('div:has(label:has-text("이 날은 안 돼요")) input[type="date"]');
    }

    async toggleHolidayExclusion() {
        await expect(this.holidayCheckbox).toBeVisible();
        await this.holidayCheckbox.click();
    }

    async toggleDay(day: string) {
        const button = this.dayButtons.get(day);
        if (button) {
            await expect(button).toBeVisible();
            await button.click();
        }
    }

    async selectEveryday() {
        await expect(this.everydayButton).toBeVisible();
        await this.everydayButton.click();
    }

    async selectWeekdays() {
        await expect(this.weekdayButton).toBeVisible();
        await this.weekdayButton.click();
    }

    async selectWeekends() {
        await expect(this.weekendButton).toBeVisible();
        await this.weekendButton.click();
    }

    async addExcludedDate(date: string) {
        await expect(this.specificDateInput).toBeVisible();
        await this.specificDateInput.fill(date);
        // Usually date inputs trigger on change/blur, verify if explicit enter/blur is needed
        await this.specificDateInput.press('Enter');
    }

    async goNext() {
        await expect(this.nextButton).toBeEnabled();
        await this.nextButton.click();
    }
}
