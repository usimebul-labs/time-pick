---
trigger: always_on
---

# Project Context

## 1. Project Overview
- **Project Name:** TimePick (타임픽)
- **Structure:** Monorepo (Turborepo)
- **Main App:** `apps/web`
- **Shared UI:** `packages/ui`
- **OS Environment:** **Windows** (PowerShell/CMD)

## 2. Tech Stack & Versions
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Monorepo Tool:** Turborepo
- **Styling:** **Tailwind CSS v4** (CSS variables & `@theme` based config)
- **UI Library:** Shadcn UI (Radix Primitives) inside `@repo/ui`
- **Navigation (Mobile Web):** **Stackflow** (Activity-based routing)
- **State Management:** Zustand (Client State), TanStack Query (Server State)
- **Backend/DB:** **Supabase (PostgreSQL)**
- **ORM:** **Prisma** (Schema management & Type-safe queries)

## 3. Development Guidelines

### A. Monorepo & Windows Environment
- **Commands:** Run commands via `pnpm` to ensure cross-platform compatibility on Windows.
  - Example: `pnpm --filter web run dev`
- **Path Handling:** Be mindful of backslashes (`\`) in Windows paths, though Node.js generally handles forward slashes (`/`) fine.

### B. Styling (Tailwind CSS v4)
- **No Config Files:** Do NOT create `tailwind.config.ts`.
- **Configuration:** Use `apps/web/app/globals.css` with `@import "tailwindcss";` and `@theme`.
- **Shared UI:** `apps/web` must strictly follow import rules (`@source "../../../packages/ui"`) to detect classes in the shared package.

### C. Navigation (Stackflow)
- **Routing:** Logic resides in `src/activities/`.
- **Entry:** `app/page.tsx` contains only the `<Stack />`.
- **Method:** Use `useFlow()` for navigation, not `next/link`.

### D. Database & ORM (Prisma + Supabase)
- **Schema Management:** Define DB structure in `packages/database/prisma/schema.prisma` (or `apps/web/prisma/...` depending on monorepo setup).
- **Migration:** Use `npx prisma db push` (for prototyping) or `npx prisma migrate dev` to sync with Supabase.
- **Client:** Use `PrismaClient` for server-side logic (Next.js Server Actions/Route Handlers).
- **Policy:** While Prisma handles data access, **Supabase RLS** policies must still be applied on the DB level if using Supabase Client on the frontend.