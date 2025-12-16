---
trigger: always_on
---

React Refactoring & Architecture Rules (Updated)
1. Role & Objective
Role: Senior React Frontend Engineer.
Objective: Implement a "Separation of Concerns" architecture where UI (View) and Logic are completely decoupled.
Scope: Apply this strictly to Page components, enforcing modularity and global state management for shared data.
2. Core Principles
A. Component Roles & Logic Extraction
Rule: Distinct responsibilities for Main (index.tsx) and Sub-components.
1. Main Component (index.tsx) Responsibility:
Layout Composition Only: Acts solely as a layout composer.
Initial Data Only: It must ONLY call the hook responsible for Initial Data Fetching (e.g., usePageLoad.ts).
No Interaction Logic: It must NOT contain event handlers, form submissions, or complex interaction logic. These belong to sub-components.
2. Sub-Component Responsibility:
Self-Contained Logic: Each Sub-component must call its own Dedicated Custom Hook (e.g., LoginForm calls useLoginForm).
Direct Invocation: Logic specific to a sub-component must reside in its corresponding hook, not passed down from the Main Component.
B. Server Data Fetching (Initialization)
Rule: Server data fetching is the primary responsibility of the Main Component's hook.
Flow:
Main Component calls use[PageName]Init().
The hook fetches necessary data and syncs it to the Zustand Store if needed by multiple children.
Main Component renders the layout based on isLoading or isError.
C. JSX Atomization
Rule: Decompose JSX into Sub-components based on logical domains.
Criteria:
If a UI section has its own interaction (e.g., a button click, input change), it is a candidate for a Sub-component.
Sub-components should be "smart" enough to handle their own logic via hooks, rather than being "dumb" components that rely entirely on props.
D. File Structure & Co-location
Rule: Modular directory structure including Stores.
Structure:
code
Text
/src/pages/LoginPage/
├── index.tsx           (Main View - Layout & Init Data only)
├── hooks/   
│   ├── useLoginInit.ts (Initial Page Data Fetching)
│   ├── useLoginForm.ts (Logic for LoginForm component)
│   └── useSocialAuth.ts(Logic for SocialAuth component)
├── stores/             (Optional: Local stores for this page)
│   └── useLoginStore.ts(Zustand Store for shared state)
└── components/         
    ├── LoginForm.tsx   (Calls useLoginForm)
    └── SocialAuth.tsx  (Calls useSocialAuth)
E. State Management Strategy (Zustand)
Rule: Eliminate Prop Drilling and "Lifting State Up" for sibling communication.
Shared State:
If State A needs to be accessed by both Sub-component X and Sub-component Y, do NOT define it in index.tsx.
Action: Create a Zustand Store (e.g., usePageStore or a global store).
Usage: Both Sub-components subscribe to the store slice they need.
Local State:
If state is strictly internal to one Sub-component (e.g., isDropdownOpen), keep it in that component's Custom Hook (useState).
3. Refactoring Instructions for AI
Restructure: Setup the folder structure (hooks/, components/, stores/) within the page directory.
Analyze State Scope:
Initial Data: Move to a hook for index.tsx (e.g., use[Page]Init).
Local Interaction: Move to a hook for the specific Sub-component (e.g., use[SubComp]).
Shared State: Identify variables used by multiple Sub-components. Move them to a Zustand Store.
Implement Store: Create the Zustand store definition for shared states.
Decouple Main Component:
Remove all useState and handler functions from index.tsx.
Ensure index.tsx only renders layout and handles loading states from the Init hook.
Connect Sub-components:
Ensure Sub-components import their specific hooks.
Ensure Sub-components import the Zustand store if they need shared data.
Verify: Check that no props are passed for the purpose of "sharing state" or "passing down callbacks."
Example Implementation Pattern
1. Store (stores/useLoginStore.ts)
code
TypeScript
import { create } from 'zustand';

interface LoginState {
  userType: 'guest' | 'member';
  setUserType: (type: 'guest' | 'member') => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  userType: 'member',
  setUserType: (type) => set({ userType: type }),
}));
2. Main Component (index.tsx)
code
Tsx
import { useLoginInit } from './hooks/useLoginInit';
import { LoginForm } from './components/LoginForm';
import { UserTypeSwitcher } from './components/UserTypeSwitcher';

export default function LoginPage() {
  // Rule 1: Only Initial Data Hook here
  const { isLoading } = useLoginInit(); 

  if (isLoading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Login</h1>
      {/* Rule 3: No props passed for state sharing */}
      <UserTypeSwitcher /> 
      <LoginForm />
    </main>
  );
}
3. Sub-Component (components/LoginForm.tsx)
code
Tsx
import { useLoginStore } from '../stores/useLoginStore';
import { useLoginForm } from '../hooks/useLoginForm';

export const LoginForm = () => {
  // Rule 3: Consume Shared State via Store
  const userType = useLoginStore((state) => state.userType);
  
  // Rule 2: Own Custom Hook for Logic
  const { register, handleSubmit } = useLoginForm(userType); 

  return (
    <form onSubmit={handleSubmit}>
      {userType === 'member' && <input {...register('email')} />}
      <button>Login</button>
    </form>
  );
};
