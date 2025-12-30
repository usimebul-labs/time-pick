import { test, expect } from '@playwright/test';

test('navigate from landing page to login page', async ({ page }) => {
    // 1. Navigate to Landing Page
    await page.goto('/');

    // 2. Locate "Start" (or similar CTA) button and click it
    // Assuming there is a link or button with text "Start" or navigating to login
    // Adjusting selector based on standard landing page patterns, potentially 'Get Started' or 'Login'
    // I will look for a link that likely leads to login or app entry. 
    // Given the request "랜딩 페이지에서 시작하기 버튼을 누르면", I'll look for "시작하기" or "Start".

    const startButton = page.getByRole('link', { name: /시작하기/i }).or(page.getByRole('button', { name: /시작하기/i }));

    // Fallback to finding by text if role is ambiguous during initial dev
    // await page.getByText('시작하기').click(); 

    await expect(startButton).toBeVisible();
    await startButton.click();

    // 3. Verify URL changes to /login (or /auth/login, checking for login path)
    await expect(page).toHaveURL(/.*login/);

    // 4. Verify Login page content
    // Assuming a heading "Login" or "Hello" or similar
    // await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});
