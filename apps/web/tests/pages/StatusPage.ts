import { Page, Locator, expect } from '@playwright/test';

export class StatusPage {
    private readonly activity: Locator;
    private readonly editButton: Locator;
    private readonly completeButton: Locator;
    private readonly viewAllFriendsButton: Locator;
    private readonly clearFilterButton: Locator;
    private readonly showMoreButton: Locator;
    private readonly slider: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');

        // Footer buttons
        this.editButton = this.activity.getByRole('button', { name: /.*일정 수정하기/ });
        this.completeButton = this.activity.getByRole('button', { name: /.*확인했어요/ });

        // Participant List interactions
        this.viewAllFriendsButton = this.activity.getByRole('button', { name: '전체 친구 보기' });

        // Filtered Slot List interactions
        this.clearFilterButton = this.activity.getByRole('button', { name: '필터 해제' });
        this.showMoreButton = this.activity.getByRole('button', { name: /더 보기|접기/ });

        // Chart interactions (Slider)
        this.slider = this.activity.locator('.cursor-ns-resize');
    }

    async clickEdit() {
        await expect(this.editButton).toBeVisible();
        await this.editButton.click();
    }

    async clickComplete() {
        await expect(this.completeButton).toBeEnabled();
        await this.completeButton.click();
    }

    async clickViewAllFriends() {
        if (await this.viewAllFriendsButton.isVisible()) {
            await this.viewAllFriendsButton.click();
        }
    }

    async clickClearFilter() {
        if (await this.clearFilterButton.isVisible()) {
            await this.clearFilterButton.click();
        }
    }

    async toggleParticipant(name: string) {
        const participantButton = this.activity.getByRole('button', { name: name }).first();
        await expect(participantButton).toBeVisible();
        await participantButton.click();
    }

    async toggleShowMore() {
        if (await this.showMoreButton.isVisible()) {
            await this.showMoreButton.click();
        }
    }
}
