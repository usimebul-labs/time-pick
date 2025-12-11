---
trigger: always_on
---

# React Refactoring & Architecture Rules

## 1. Role & Objective
- **Role**: Senior React Frontend Engineer.
- **Objective**: Implement a "Separation of Concerns" architecture where UI (View) and Logic are completely decoupled.
- **Scope**: Apply this strictly to Page components, especially for scenarios like the Login Page where UI varies slightly based on the entry path.

## 2. Core Principles

### A. Single Component Strategy
- **Rule**: Do not create separate Page components for slight UI variations (e.g., "Normal Login" vs. "Share Link Login").
- **Implementation**:
  - Use a **single component** (e.g., `LoginPage`).
  - Distinguish modes using **URL Query Parameters** (e.g., `?mode=share`) or **Location State**.
  - Use **Conditional Rendering** (`{condition && <Component />}`) to show/hide specific UI elements like the "Guest Login" form.

### B. Logic Extraction (Custom Hooks)
- **Rule**: All state management, side effects, and data fetching must be extracted into a **Custom Hook**.
- **Constraint**: The View Component must **NOT** contain:
  - `useEffect` or direct API calls.
  - Complex event handler logic.
  - State definitions (`useState`) other than simple UI toggles.
- **Naming**: `use[PageName].ts` (e.g., `useLoginPage`).

### C. Server Data Fetching
- **Rule**: Server data fetching must be handled inside the Custom Hook.
- **Flow**:
  1. Hook parses URL parameters.
  2. `useEffect` inside the Hook calls the API.
  3. Hook exposes `data`, `isLoading`, and `error` states to the View.

### D. JSX Atomization
- **Rule**: If the JSX inside `return (...)` exceeds readable limits (e.g., > 50 lines), break it down into **Sub-components**.
- **Example**: Extract `<SocialLoginSection />` or `<GuestLoginForm />` instead of writing raw HTML.

---

## 3. Code Structure Template

When refactoring or writing code, strictly follow this pattern:

### Step 1: Logic (The Custom Hook)
**File**: `src/hooks/useLoginPage.ts`

```typescript
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import { api } from '@/api';

export const useLoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Parse Mode & Redirect URL
  const isShareMode = searchParams.get('mode') === 'share';
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  // 2. State
  const [serverData, setServerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Data Fetching (Encapsulated in Hook)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const response = await api.auth.getLoginInfo(isShareMode);
        // setServerData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isShareMode]);

  // 4. Handlers
  const handleSocialLogin = (provider: string) => {
    // Logic for redirection to OAuth provider
    window.location.href = `/api/auth/${provider}?next=${redirectUrl}`;
  };

  return {
    serverData,
    isLoading,
    isShareMode,
    handleSocialLogin,
  };
};
```

### Step 2: View (The Component)
**File**: `src/pages/LoginPage.tsx`

```tsx
import { useLoginPage } from '@/hooks/useLoginPage';
import { SocialButtons } from './components/SocialButtons';
import { GuestLoginForm } from './components/GuestLoginForm';

export const LoginPage = () => {
  // 1. Consume Logic (Controller)
  const { 
    serverData, 
    isLoading, 
    isShareMode, 
    handleSocialLogin 
  } = useLoginPage();

  // 2. Handle Loading State
  if (isLoading) return <div>Loading...</div>;

  // 3. Render UI
  return (
    <div className="login-container">
      <h1>{isShareMode ? 'Join Shared Calendar' : 'Welcome Back'}</h1>
      
      {/* Shared UI */}
      <SocialButtons onLogin={handleSocialLogin} />

      {/* Conditional UI based on Entry Path */}
      {isShareMode && (
        <div className="guest-section">
          <p>Or continue as a guest:</p>
          <GuestLoginForm 
            redirectUrl={serverData?.targetUrl} 
          />
        </div>
      )}
    </div>
  );
};
```

---

## 4. Refactoring Instructions for AI

1.  **Analyze**: Identify `useState`, `useEffect`, and API calls in the target component.
2.  **Separate**: Move all identified logic into a new file named `hooks/use[ComponentName].ts`.
3.  **Clean Up**: Replace logic in the original component with the hook call.
4.  **Simplify**: If the component renders conditional blocks (like Guest Login), ensure they are wrapped in clean `{ condition && <Component /> }` syntax.