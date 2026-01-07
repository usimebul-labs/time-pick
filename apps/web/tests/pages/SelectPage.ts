import { Page, Locator, expect } from '@playwright/test';

export class SelectPage {
    private readonly activity: Locator;
    private readonly submitButton: Locator;
    private readonly deselectAllButton: Locator;
    private readonly sameScheduleButton: Locator;
    private readonly cells: Locator;

    // Calendar details
    private readonly detailsHeader: Locator;

    constructor(private readonly page: Page) {
        this.activity = page.locator('[data-stackflow-activity-is-active="true"]');

        // Footer button
        this.submitButton = this.activity.getByRole('button', { name: /.*선택 완료/ });

        // Calendar interactions
        this.deselectAllButton = this.activity.getByRole('button', { name: '전체 선택 해제' });

        // Participant interactions
        this.sameScheduleButton = this.activity.getByRole('button', { name: '같은 일정으로 선택하기' });

        // Select all potential date/time slots. 
        // Monthly: button[data-date]
        // Weekly: div[data-date] (that are not disabled)
        this.cells = this.activity.locator('button[data-date]:not([disabled])');

        // Details
        this.detailsHeader = this.activity.locator('h3', { hasText: '상세 보기' });
    }

    async selectDate(dateText: string) {
        // Legacy support if needed, but prefer specific methods below
        const dateCell = this.activity.getByRole('button', { name: dateText, exact: true }).first();
        await dateCell.click();
    }

    async selectRandomCells() {
        await expect(this.cells.first()).toBeEnabled();

        const count = await this.cells.count();
        if (count === 0) throw new Error('No calendar cells found');

        // Select randomly between 2 and 5 cells (or count if less)
        // Ensure at least 1 is selected, but user asked for "multiple" if possible so let's try 2+ if available
        const maxSelection = Math.min(count, 5);
        const minSelection = Math.min(count, 2);

        const selectionCount = Math.floor(Math.random() * (maxSelection - minSelection + 1)) + minSelection;

        const indices = new Set<number>();
        while (indices.size < selectionCount) {
            indices.add(Math.floor(Math.random() * count));
        }

        console.log(`Selecting ${selectionCount} cells...`);

        for (const index of indices) {
            const cell = this.cells.nth(index);
            // Ensure visible and enabled before clicking
            await cell.scrollIntoViewIfNeeded();
            await cell.click({ force: true });
        }
    }

    /**
     * Selects a date in the Monthly calendar view
     * @param dateStr Date string in 'YYYY-MM-DD' format
     */
    async selectMonthlyDate(dateStr: string) {
        // Select button with data-date attribute starting with the date string
        // Note: data-date is usually ISO string (UTC). 
        // We match strictly if possible, or partial match.
        // Assuming user passes local YYYY-MM-DD, and the component renders UTC ISO or Local ISO.
        // Let's use generic partial match on data-date attribute.
        // CSS selector: [data-date^="YYYY-MM-DD"]
        const cell = this.activity.locator(`button[data-date*="${dateStr}"]`).first();
        await expect(cell).toBeVisible();
        await cell.click();
    }

    /**
     * Selects a time slot in the Weekly calendar view
     * @param dateStr Date string in 'YYYY-MM-DD' format
     * @param hour Hour (0-23)
     */
    async selectWeeklySlot(dateStr: string, hour: number) {
        // Convert hour to usually expected format or just match data-date.
        // Weekly grid cells use data-date attribute which is ISO string of the slot.
        // Need to be careful with timezone.
        // If we want to target a specific slot, we might need to know exactly how it's rendered.
        // Safe bet: [data-date*="YYYY-MM-DD"][data-date*="THH:"] where HH is hour padded.

        const paddedHour = String(hour).padStart(2, '0');
        // Selector matching date AND hour part of ISO string
        // This is heuristic but usually works if input dateStr matches the stored date string's YYYY-MM-DD part
        const cell = this.activity.locator(`div[data-date*="${dateStr}"][data-date*="T${paddedHour}:"]`).first();

        // In weekly view, cells might be just divs, not buttons, but interactable
        // WeekGridCell uses onPointerDown
        await expect(cell).toBeVisible();
        // Use standard click, or force click if it's not a button
        await cell.click({ force: true });
    }

    async submit() {
        await expect(this.submitButton).toBeVisible();
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();
    }

    async clickDeselectAll() {
        if (await this.deselectAllButton.isVisible()) {
            await this.deselectAllButton.click();
        }
    }

    async clickSameSchedule() {
        await expect(this.sameScheduleButton).toBeVisible();
        await this.sameScheduleButton.click();
    }

    async toggleDetails() {
        await this.detailsHeader.click();
    }
}
