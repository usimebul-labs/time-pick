---
trigger: always_on
---

코드 작성 시 아래 원칙을 준수할 것

## 1. Code & Naming

- **함수 추출:** 의도가 드러나게 작게 분리. '어떻게'보다 '무엇을' 명시.
- **명명:** 모호한 축약어 금지. 주석 없이 이해 가능한 이름 사용.
- **주석 삭제:** 주석이 필요한 로직은 함수로 추출하여 코드로 설명.

## 2. Data Handling

- **불변성:** `const` 기본 사용. 가변 데이터 최소화.
- **캡슐화:** 레코드/컬렉션은 직접 노출 금지 (`Encapsulate Record`).
- **객체화:** 단순 값(전화번호 등)은 의미 있는 객체로 변환 (`Replace Primitive with Object`).

## 3. Control Flow

- **보호 구문:** 중첩 `if` 제거, Guard Clauses(`return`)로 평탄화.
- **파이프라인:** 반복문 대신 `map`, `filter`, `reduce` 체이닝 선호.
- **다형성:** 복잡한 `switch`/`if`는 다형성으로 대체.

## 4. Structure

- **단계 쪼개기:** 파싱과 로직 등 성격이 다른 코드는 `Split Phase`로 분리.
- **위임:** 상속 오남용 금지. 유연한 '위임(Delegation)' 선호.

## 5. React Architecture

- **Logic 분리:** UI와 비즈니스 로직 완전 분리. 로직은 무조건 `Custom Hook`으로 추출.
- **컴포넌트 분할:** UI 섹션이 구분되면 즉시 하위 컴포넌트로 분리 (`Extract Component`).
- **Hook 위임:** 하위 컴포넌트는 Props 드릴링 대신, 전용 `Custom Hook`을 직접 호출하여 로직 수행.
- **Data Fetching:** 페이지(부모)가 초기 데이터 Fetch 담당. `loading`, `error` 상태 반드시 포함하여 반환.
- **State Management:** 전역/공유 상태는 `zustand` Store 사용.
- **폴더 구조(Colocation):** 컴포넌트 단위 폴더링 준수.
  - 구조: `FeatureName/` -> `index.tsx`, `components/`, `hooks/` (Store 포함).

## 5. Next.js Server Actions

- **Validation:** 모든 Input은 `Zod`로 검증. 실패 시 즉시 반환.
- **Thin Controller:** Action은 DB 직접 접근 금지. 비즈니스 로직은 별도 Service/Utils 함수로 위임.
- **Try-Catch:** 모든 Action은 `try-catch`로 감싸고, `{ success, data, error }` 표준 포맷 반환.
- **Revalidation:** Mutation 성공 시 `revalidatePath` 또는 `revalidateTag` 필수 실행.
- **Client Usage:** 클라이언트는 `useActionState` 또는 `useTransition`으로 Pending/Error 상태 처리.
