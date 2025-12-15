---
trigger: always_on
---

# React Refactoring & Architecture Rules

## 1. Role & Objective
- **Role**: Senior React Frontend Engineer.
- **Objective**: Implement a "Separation of Concerns" architecture where UI (View) and Logic are completely decoupled.
- **Scope**: Apply this strictly to Page components, especially for scenarios like the Login Page where UI varies slightly based on the entry path.

## 2. Core Principles
### A. Logic Extraction (Custom Hooks)
- **Rule**: All state management, side effects, and data fetching must be extracted into a **Custom Hook**.
- **Constraint**: The View Component must **NOT** contain:
  - `useEffect` or direct API calls.
  - Complex event handler logic.
  - State definitions (`useState`) other than simple UI toggles.
- **Directory**: Custom hooks must be placed inside the `hooks` directory within the component folder.
- **Logic Cohesion**:
  - **Single Responsibility**: A hook should only contain **related** business logic. If a page handles distinct logical domains (e.g., "Form Validation" vs "Data Fetching"), split them into separate hooks (e.g., `useLoginForm.ts`, `usePageData.ts`) instead of creating one giant hook.
- **Direct Consumption**:
  - **Sub-component Usage**: If a sub-component requires specific business logic, it must **import and call the relevant Custom Hook directly**. Do not pass complex state or handlers from the parent `index.tsx` via props (Avoid Prop Drilling).

### B. Server Data Fetching
- **Rule**: Server data fetching must be handled inside the Custom Hook.
- **Flow**:
  1. Hook parses URL parameters.
  2. `useEffect` inside the Hook calls the API.
  3. Hook exposes `data`, `isLoading`, and `error` states to the View.

### C. JSX Atomization
- **Rule**: Decompose JSX into Sub-components when a UI section is visually distinct and has no functional coupling or direct dependency on other sibling sections.
- **Criteria**: 
  1. Focus on Logical Independence rather than line count.
  2. If Section A (e.g., Social Login) changes, it should not affect Section B (e.g., Guest Form).
  3. Each sub-component should be self-contained in terms of its display logic.

### D. File Structure & Co-location (Folder Encapsulation)
- **Rule**: Refactor single-file components into a modular directory structure.
- **Structure**:
  - Create a folder named exactly after the component (e.g., `LoginPage/`).
  - Rename the main component file to `index.tsx` and move it inside.
  - Create a `hooks/` directory for logic.
  - Place related sub-components within the folder.
- **Example**:
  ```text
  /src/pages/LoginPage/
  ├── index.tsx           (Main View - Composition only)
  ├── hooks/   
  │   ├── useLoginData.ts (Data Fetching)
  │   └── useAuthForm.ts  (Form Logic)
  └── components/         (Sub-components)
  ```

## 3. Refactoring Instructions for AI

1.  **Restructure (Folder Creation)**: 
    - Create a directory named `[ComponentName]`.
    - Move the original `[ComponentName].tsx` into this directory and rename it to `index.tsx`.
    - Create a `hooks` folder inside.
2.  **Analyze**: Identify `useState`, `useEffect`, and API calls in the `index.tsx`. Group them by logical domain.
3.  **Separate**: 
    - Create distinct hooks in `hooks/` folder based on logic groups (e.g., `use[Feature].ts`).
    - Move the logic into these hooks.
4.  **Assign**: 
    - If logic belongs to a specific sub-component, make the sub-component call the hook directly.
    - If logic is for the main layout, call it in `index.tsx`.
5.  **Clean Up**: Replace logic in the `index.tsx` with the hook calls or sub-components.
6.  **Simplify**: If the component renders conditional blocks, wrap them in clean `{ condition && <SubComponent /> }` syntax.