import { Page, Locator, expect } from '@playwright/test';


export class LandingPage {
    private readonly activity: Locator;
    private readonly startButton: Locator;
    private readonly loginButton: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');
        this.startButton = this.activity.getByRole('button', { name: '시작하기' });
        this.loginButton = this.activity.getByRole('button', { name: '로그인' });
    }

    async goToCreateAfterlogin() {
        await expect(this.startButton).toBeVisible();
        await expect(this.startButton).toBeEnabled();
        await this.startButton.click();
    }

    async goToLogin() {
        await expect(this.loginButton).toBeVisible();
        await expect(this.loginButton).toBeEnabled();
        await this.loginButton.click();
    }
}