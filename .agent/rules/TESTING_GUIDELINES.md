---
trigger: always_on
---

## 1. Playwright Testing (Stackflow)

- **Animation Off:** `beforeEach`에서 CSS(`* { transition: none !important; animation: none !important; }`)를 주입하여 모든 전환 효과 강제 제거.
- **Scoped Locators:** 전역 `page` 검색 금지. 중첩된 DOM 방지를 위해 활성화된 Activity(`[data-stackflow-activity-status="active"]`) 내에서만 요소 탐색.
- **Auto-waiting:** 고정 시간 대기(`waitForTimeout`) 절대 금지. `expect().toBeVisible()` 등 Retry 로직이 내장된 Web-first Assertion 사용.
- **Network Sync:** 페이지 전환이나 데이터 로딩 시, `Promise.all`을 사용하여 `waitForResponse`와 Action(Click)을 병렬로 수행하여 응답 대기.
- **Robust Selectors:** 텍스트나 좌표 대신 변경 가능성이 낮은 `data-testid` 또는 `Role` 기반 Selector 우선 사용.

## 2. Test Refactoring (Page Object Model)

- **POM 적용:** 화면(Activity) 단위로 `Class`를 정의하여 Selector와 Action을 캡슐화. 테스트 파일에는 비즈니스 로직만 남김.
- **Fixture 주입:** `new Page(page)` 직접 인스턴스화 금지. `test.extend`를 사용해 **Custom Fixture**로 의존성 주입.
- **Intent Naming:** 메서드명은 사용자 의도(`login`, `submitOrder`)로 작성. 구현 세부사항(`clickButton`, `typeText`) 노출 금지.
- **Step Grouping:** 반복되는 긴 시나리오(로그인 등)는 별도 `setup` 함수나 `globalSetup`으로 분리하지 않고 POM 메서드로 통합.
