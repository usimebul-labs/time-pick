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


## 3. Refactoring Instructions for AI

1.  **Analyze**: Identify `useState`, `useEffect`, and API calls in the target component.
2.  **Separate**: Move all identified logic into a new file named `hooks/use[ComponentName].ts`.
3.  **Clean Up**: Replace logic in the original component with the hook call.
4.  **Simplify**: If the component renders conditional blocks (like Guest Login), ensure they are wrapped in clean `{ condition && <Component /> }` syntax.