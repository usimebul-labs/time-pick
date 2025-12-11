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
- **Naming**: `use[PageName].ts` (e.g., `useLoginPage`).

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
  - Place the extracted custom hook and related sub-components within this folder.
- **Example**:
  ```text
  /src/pages/LoginPage/
  ├── index.tsx           (Main View)
  ├── useLoginPage.ts     (Logic Hook)
  └── components/         (Optional: Private sub-components)
  ```

## 3. Refactoring Instructions for AI

1.  **Restructure (Folder Creation)**: 
    - Create a directory named `[ComponentName]`.
    - Move the original `[ComponentName].tsx` into this directory and rename it to `index.tsx`.
2.  **Analyze**: Identify `useState`, `useEffect`, and API calls in the `index.tsx`.
3.  **Separate**: Move all identified logic into a new file named `[ComponentName]/use[ComponentName].ts`.
4.  **Clean Up**: Replace logic in the `index.tsx` with the hook call.
5.  **Simplify**: If the component renders conditional blocks (like Guest Login), ensure they are wrapped in clean `{ condition && <SubComponent /> }` syntax and place `SubComponent` within the same folder.