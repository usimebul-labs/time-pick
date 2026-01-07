import { test, expect } from './fixtures'; // 커스텀 fixture import

test.describe('통합 테스트', () => {
    test.setTimeout(60000); // Increase timeout for full flow

    test('랜딩 페이지에서 일정 확정 까지', async ({ page, landingPage, loginPage }) => {
        console.log("STEP1: 랜딩 페이지에서 시작 버튼 클릭")
        await page.goto('/');
        await landingPage.goToCreateAfterlogin();

        const nextPath = encodeURIComponent('/app/calendar/new');
        await expect(page).toHaveURL(new RegExp(`app/login/\\?next=${nextPath}`));

        console.log("STEP2: 로그인 페이지에서 테스트 계정으로 로그인")
        await loginPage.loginWithTestAccount();

        // TODO
    });
});
