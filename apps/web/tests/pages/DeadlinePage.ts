import { Page, Locator, expect } from '@playwright/test';

export class DeadlinePage {
    private readonly activity: Locator;

    private readonly unlimitedCheckbox: Locator;
    private readonly deadlineInput: Locator;
    private readonly submitButton: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');
        this.unlimitedCheckbox = this.activity.getByText('마감 시간은 정하지 않을래요');
        this.deadlineInput = this.activity.locator('input[type="datetime-local"]');
        this.submitButton = this.activity.getByRole('button', { name: /캘린더 만들고 초대하기|생성 중.../ });
    }

    async toggleUnlimited() {
        await expect(this.unlimitedCheckbox).toBeVisible();
        await this.unlimitedCheckbox.click();
    }

    async setDeadline(daysFromNow: number = 1) {
        // Uncheck unlimited if checked
        // Note: The logic in component is if checked -> disabled input. 
        // We should ensure it's unchecked if we want to set deadline. 
        // But for robust E2E, let's just assume we call this when we want to set it.
        // Or we can check state. For now just set input.

        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        date.setHours(23, 59);
        const deadlineStr = date.toISOString().slice(0, 16);

        await expect(this.deadlineInput).toBeVisible();
        await this.deadlineInput.fill(deadlineStr);
    }

    async submit() {
        await expect(this.submitButton).toBeVisible();
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();

        // Wait for Loading overlay or redirect
        // Since this is final submission, it might redirect to 'Select' or similar.
        // We handle the assertion in the test file usually.
        // But preventing double clicks is good.
        await expect(this.page.locator('.animate-spin')).not.toBeVisible();
    }
}
