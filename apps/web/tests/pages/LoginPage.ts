import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private static readonly TEST_EMAIL = 'usimebul@signgate.com';
    private static readonly TEST_PASSWORD = 'signgate1!';
    private readonly activity: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly submitButton: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');
        this.emailInput = this.activity.getByPlaceholder('이메일');
        this.passwordInput = this.activity.getByPlaceholder('비밀번호');
        this.submitButton = this.activity.getByRole('button', { name: '이메일로 계속하기' });
    }

    async loginWithTestAccount() {
        await expect(this.emailInput).toBeEditable();
        await expect(this.passwordInput).toBeEditable();
        await this.emailInput.fill(LoginPage.TEST_EMAIL);
        await this.passwordInput.fill(LoginPage.TEST_PASSWORD);
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();
    }
}
