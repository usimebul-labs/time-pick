# Project Rules

## 1. Project Overview
- **Project Name:** TimePick (타임픽)
- **Structure:** Monorepo (Turborepo)
- **Main App:** `apps/web`
- **Shared UI:** `packages/ui`
- **OS Environment:** Windows (PowerShell/CMD)

## 2. Tech Stack & Versions
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Library:** Shadcn UI (Radix Primitives) inside `@repo/ui`
- **Navigation:** Stackflow (Activity-based routing)

## 3. UX & Design Guidelines (NEW)
- **Korean First:** All user-facing text must be in natural, trendy Korean suitable for a modern SaaS.
- **Korean-Friendly UX:**
    - Use clear, emotive copy (e.g., "시작하기" instead of just "Start").
    - Layouts should be spacious and readable.
    - Input formats (dates, phone numbers) should follow Korean standards (YYYY.MM.DD).
- **Aesthetics:** High-contrast, clean, "premium" feel.

## 4. Development Guidelines
- **Commands:** Use `pnpm`.
- **Styling:** Use `apps/web/app/globals.css` with `@theme`.
- **Styling:** Use `apps/web/app/globals.css` with `@theme`.
- **Navigation (Mobile Web):** Stackflow (Activity-based routing)
- **Routing:** Logic resides in `src/activities/`.
- **Enforcement:** **ALWAYS** use Stackflow for application screens. Do not create new Next.js pages (`app/*`) unless it is a landing page or API route.
- **Entry:** `app/page.tsx` contains only the `<Stack />`.
- **Method:** Use `useFlow()` for navigation, not `next/link`.
