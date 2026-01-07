import { test, expect } from './fixtures'; // 커스텀 fixture import
import { SelectPage } from './pages/SelectPage';

test.describe('통합 테스트', () => {
    test('랜딩 페이지에서 일정 확정 까지', async ({ page, landingPage, loginPage, basicInfo, calendarTypePage, dateRangePage, exclusionsPage, deadlinePage, selectPage }) => {
        console.log("STEP1: 랜딩 페이지에서 시작 버튼 클릭")
        await page.goto('/');
        await landingPage.goToCreateAfterlogin();
        const nextPath = encodeURIComponent('/app/calendar/new');
        await expect(page).toHaveURL(new RegExp(`app/login/\\?next=${nextPath}`));

        console.log("STEP2: 로그인 페이지에서 테스트 계정으로 로그인")
        await loginPage.loginWithTestAccount();
        await expect(page).toHaveURL(new RegExp('app/calendar/new'));

        console.log("STEP3-1: 캘린더 생성하기 (기본 정보 입력)")
        const timestamp = Date.now();
        const testTitle = `Full Test ${timestamp}`;
        const testDesc = `기본 설정된 값으로 전체 테스트`;
        await basicInfo.fillBasicInfo(testTitle, testDesc);
        await expect(page).toHaveURL(new RegExp('app/calendar/new/type'));

        console.log("STEP3-2: 캘린더 타입 선택 (월간)")
        await calendarTypePage.selectMonthlyType();
        await expect(page).toHaveURL(new RegExp('app/calendar/new/date'));

        console.log("STEP3-2: 캘린더 기간 선택")
        await dateRangePage.goNext();
        await expect(page).toHaveURL(new RegExp('app/calendar/new/exclusions'));

        console.log("STEP3-3: 제외할 날짜 선택")
        await exclusionsPage.goNext();
        await expect(page).toHaveURL(new RegExp('app/calendar/new/deadline'));

        console.log("STEP3-4: 마감일 설정")
        await deadlinePage.submit();
        await expect(page).toHaveURL(new RegExp('app/calendar/[a-f0-9-]+/'));

        console.log("STEP4: 일정 선택")
        await selectPage.selectRandomCells();
        await selectPage.submit();
        await expect(page).toHaveURL(new RegExp('app/calendar/[a-f0-9-]+/status'));
    });
})
