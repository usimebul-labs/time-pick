import { Page, Locator, expect } from '@playwright/test';

export class BasicInfo {
    private readonly activity: Locator;
    private readonly titleInput: Locator;
    private readonly memoInput: Locator;
    private readonly nextButton: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');
        this.titleInput = this.activity.getByPlaceholder('예: 팀 주간 회의, 점심 약속');
        this.memoInput = this.activity.getByPlaceholder('일정에 대한 간단한 설명을 적어주세요.');
        this.nextButton = this.activity.getByRole('button', { name: '다음' });
    }

    async fillBasicInfo(title: string, description: string) {
        await expect(this.titleInput).toBeEditable();
        await expect(this.memoInput).toBeEditable();
        await this.titleInput.fill(title);
        await this.memoInput.fill(description);
        await expect(this.nextButton).toBeEnabled();
        await this.nextButton.click();
    }
}
