# DevReview Frontend

A professional, role-based project review platform built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. Students submit projects, reviewers score them against a shared rubric, and admins manage users, assignments, and platform-wide analytics.

---

## Table of contents

- [Overview](#overview)
- [Features by role](#features-by-role)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Application structure](#application-structure)
- [Routing map](#routing-map)
- [Architecture](#architecture)
- [Data and API layer](#data-and-api-layer)
- [Authentication and authorization](#authentication-and-authorization)
- [Submission lifecycle](#submission-lifecycle)
- [Review criteria](#review-criteria)
- [Design system](#design-system)
- [Conventions](#conventions)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

DevReview replaces scattered feedback with a traceable review workflow:

1. A **student** creates a submission (title, summary, repository, demo, stack, screenshots) and submits it.
2. An **admin** assigns a **reviewer**.
3. The **reviewer** starts the review, scores six criteria, and records a decision with written feedback.
4. The **student** sees the outcome, requests or applies changes, and resubmits if needed.
5. Every state change is stored in the submission history and mirrored in notifications and audit logs.

The frontend is a single Next.js App Router application that talks to a separate REST API over HTTP with cookie-based sessions.

---

## Features by role

### Student

- Dashboard with submission counts, status breakdown, and average score.
- Create, edit, delete, and publish draft submissions.
- Track status changes and review feedback per project.
- Read notifications and manage account details.

### Reviewer

- Workspace with pending, completed, and historical reviews.
- Accept assignments and start reviews.
- Score six criteria and submit a decision with feedback.
- Browse submission details and review the project history.

### Admin

- Platform analytics: users, submissions, reviews, approval rate, active assignments.
- User management: search, filter, view, change role, change status, delete.
- Submission oversight: list, filter, inspect, and create submissions.
- Review assignment management and reviewer selection.
- Review criteria management.
- Audit log with action/entity filters.
- Notifications and full account management.

### Public

- Marketing landing page with workflow and feature overview.
- Sign in, sign up, email verification (OTP), forgot password, and password reset (OTP).
- Theme toggle (dark by default, light available).
- Accessible error states for 403 and 404.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js `16.4.2` (App Router, React Compiler enabled) |
| UI runtime | React `19.3.0` |
| Language | TypeScript `5` |
| Styling | Tailwind CSS `v4` + `tw-animate-css` |
| Component system | shadcn/ui (`radix-lyra` style) on `radix-ui` |
| Icons | `lucide-react` |
| Data fetching | TanStack Query `v5` |
| HTTP client | `ofetch` |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Charts | `recharts` |
| Toasts | `sonner` |
| Theming | `next-themes` |
| Linting/formatting | Biome `2.5.15` |
| Package manager | Bun `1.4.2` |

Next.js is configured with `cacheComponents`, `partialPrefetching`, and `reactCompiler` in `next.config.ts`.

---

## Getting started

### Prerequisites

- Node.js 20+ (or Bun 1.4+)
- Bun installed (`npm i -g bun`) — the repo is pinned to `bun@1.4.2`
- A running DevReview API instance

### Install

```bash
bun install
```

### Configure

```bash
cp .env.example .env
```

Set `NEXT_PUBLIC_API_URL` to your API base URL. The default expects:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Demo role shortcuts are shown on the sign-in card (`student@devreview.dev`, `reviewer@devreview.dev`, `admin@devreview.dev`) when those accounts have been seeded by the API.

### Production build

```bash
bun run build
bun run start
```

---

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the REST API, including the version prefix (for example `/api/v1`). |

All requests are sent with `credentials: "include"`, so the API must have CORS and cookies configured for the frontend origin.

---

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the development server. |
| `bun run build` | Create an optimized production build. |
| `bun run start` | Serve the production build. |
| `bun run lint:biome` | Run Biome lint rules. |
| `bun run format` | Format the codebase with Biome. |
| `bun run check` | Run Biome lint + format checks. |
| `bun run check:write` | Apply safe Biome fixes. |

---

## Application structure

```text
src/
├─ api/                    # Thin REST clients, one file per domain
├─ app/
│  ├─ (public)/
│  │  ├─ (auth)/           # Login, signup, verification, password reset
│  │  └─ (site)/           # Marketing landing page
│  ├─ (dashboard)/
│  │  ├─ admin/            # Admin workspace
│  │  ├─ reviewer/         # Reviewer workspace
│  │  ├─ student/          # Student workspace
│  │  └─ layout.tsx        # Auth guard for all dashboards
│  ├─ globals.css          # Tailwind v4 entry + design tokens
│  ├─ layout.tsx           # Root layout, fonts, providers, metadata
│  └─ not-found.tsx
├─ components/
│  ├─ auth/                # AuthGuard, RoleGuard, loading screen
│  ├─ dashboard/           # Shell, sidebar, profile, submissions, reviews
│  ├─ dialog/              # Destructive and management dialogs
│  ├─ dropdown/            # User menu
│  ├─ errors/              # Access denied state
│  ├─ forms/               # Auth, submission, review, profile forms
│  ├─ layout-public/       # Public navbar and footer
│  ├─ notifications/       # Notification list
│  ├─ shared/              # Page header, stat cards, toolbar, states, pagination
│  ├─ table/               # Users and submissions tables
│  ├─ theme-toggle.tsx
│  └─ ui/                  # shadcn/ui primitives
├─ hooks/                  # TanStack Query hooks per domain
├─ lib/
│  ├─ apiClint.ts          # Configured ofetch instance
│  └─ utils.ts             # `cn` helper
├─ providers/              # Query, theme, and tooltip providers
├─ routes/                 # Sidebar navigation per role
└─ types/                  # Domain types and API contracts
```

---

## Routing map

### Public and authentication

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing page. |
| `/login` | Sign in with email/password or demo role. |
| `/signup` | Create an account. |
| `/verify-email` | Verify account with a 6-digit OTP. |
| `/forgot-password` | Request a password reset code. |
| `/forgot-password-otp-verify` | Verify reset OTP and set a new password. |

### Student (`/student`)

| Route | Purpose |
| --- | --- |
| `/student` | Student dashboard. |
| `/student/submissions` | Submission list. |
| `/student/submissions/my-submissions` | Own submissions. |
| `/student/submissions/new` | Create a submission. |
| `/student/submissions/[id]` | Submission details and history. |
| `/student/feedback` | Reviews received. |
| `/student/notifications` | Notifications. |
| `/student/profile` | Profile overview. |
| `/student/update-my-profile` | Edit profile and avatar. |
| `/student/change-password` | Change password. |

### Reviewer (`/reviewer`)

| Route | Purpose |
| --- | --- |
| `/reviewer` | Reviewer dashboard. |
| `/reviewer/assignments` | Assigned projects. |
| `/reviewer/reviews/pending` | Pending reviews. |
| `/reviewer/reviews/completed` | Completed reviews. |
| `/reviewer/reviews/history` | Submitted review history. |
| `/reviewer/submissions` | All submissions. |
| `/reviewer/submissions/[id]` | Review a submission. |
| `/reviewer/notifications` | Notifications. |
| `/reviewer/profile` | Profile overview. |
| `/reviewer/update-my-profile` | Edit profile. |
| `/reviewer/change-password` | Change password. |

### Admin (`/admin`)

| Route | Purpose |
| --- | --- |
| `/admin` | Platform dashboard with recent activity. |
| `/admin/analytics` | Platform analytics. |
| `/admin/users` | User management. |
| `/admin/submissions` | All submissions. |
| `/admin/submissions/my-submissions` | Submissions owned by the admin. |
| `/admin/submissions/new` | Create a submission. |
| `/admin/submissions/[id]` | Submission details. |
| `/admin/reviews` | All reviews. |
| `/admin/assignments` | Assign reviewers and monitor progress. |
| `/admin/review-criteria` | Manage review criteria. |
| `/admin/notifications` | Notifications. |
| `/admin/audit-logs` | Audit log. |
| `/admin/profile` | Profile overview. |
| `/admin/update-my-profile` | Edit profile. |
| `/admin/change-password` | Change password. |

---

## Architecture

The project separates concerns into five layers:

1. **Routes** (`src/app`) compose pages and attach metadata or role layouts.
2. **Components** render UI. Domain components sit in `components/dashboard`, `components/forms`, and `components/table`; primitives live in `components/ui`.
3. **Hooks** (`src/hooks`) wrap TanStack Query and expose `useX` APIs with query keys and mutations.
4. **API clients** (`src/api`) define one function per endpoint and never contain UI logic.
5. **Types** (`src/types`) describe payloads, list queries, and domain models shared across layers.

Shared UI building blocks keep pages consistent:

- `PageHeader` / `SectionHeading` — page titles, eyebrows, descriptions, actions.
- `StatCard` — dashboard metrics.
- `DataToolbar` / `FilterSelect` — search and filter bars.
- `DataPagination` — paginated lists.
- `LoadingState`, `ErrorState`, `EmptyState`, `TableSkeleton`, `CardSkeleton` — consistent async states.
- `components/ui/*` — shadcn primitives.

The dashboard shell (`DashboardShell`) provides the sidebar, sticky header, user menu, theme toggle, and a centered content container. Role layouts guard access before the shell renders.

---

## Data and API layer

`src/lib/apiClint.ts` configures `ofetch`:

- Base URL from `NEXT_PUBLIC_API_URL`.
- `credentials: "include"` for cookie sessions.
- Automatic error extraction from `response._data.message`, thrown as `Error`.

Each domain has a paired API client and hook module:

| Domain | API client | Hooks |
| --- | --- | --- |
| Auth | `api/auth.api.ts` | `hooks/auth.hook.ts` |
| Users | `api/user.api.ts` | `hooks/user.hook.ts` |
| Submissions | `api/submission.api.ts` | `hooks/submission.hook.ts` |
| Reviews | `api/review.api.ts` | `hooks/review.hook.ts` |
| Assignments | `api/assignment.api.ts` | `hooks/assignment.hook.ts` |
| Analytics | `api/analytics.api.ts` | `hooks/analytics.hook.ts` |
| Notifications | `api/notification.api.ts` | `hooks/notification.hook.ts` |
| Audit logs | `api/audit.api.ts` | `hooks/audit.hook.ts` |

### Endpoints used

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create account. |
| `POST` | `/auth/verify-email` | Verify email with OTP. |
| `POST` | `/auth/resend-otp` | Resend verification code. |
| `POST` | `/auth/login` | Sign in. |
| `POST` | `/auth/logout` | Sign out. |
| `GET` | `/auth/me` | Current user. |
| `POST` | `/auth/forgot-password` | Request reset code. |
| `POST` | `/auth/forgot-password-otp-verify` | Verify code and reset password. |
| `PATCH` | `/user/profile-update` | Update name/avatar (multipart). |
| `PATCH` | `/user/me/password` | Change password. |
| `GET` | `/user/all` | List users (admin). |
| `GET` | `/user/:id` | User details (admin). |
| `PATCH` | `/user/:id/status` | Change user status. |
| `PATCH` | `/user/:id/role` | Change user role. |
| `DELETE` | `/user/:id` | Delete user. |
| `GET` | `/submissions` | List all submissions. |
| `GET` | `/submissions/my` | Own submissions. |
| `GET` | `/submissions/reviewer` | Reviewer-visible submissions. |
| `GET` | `/submissions/:id` | Submission details. |
| `POST` | `/submissions` | Create submission (multipart). |
| `PATCH` | `/submissions/:id` | Update submission (multipart). |
| `DELETE` | `/submissions/:id` | Delete submission. |
| `POST` | `/submissions/:id/submit` | Publish a draft. |
| `POST` | `/submissions/:id/reviews` | Create a review. |
| `GET` | `/reviews` | List reviews. |
| `GET` | `/reviews/criteria` | Active criteria. |
| `GET` | `/admin/review-criteria` | All criteria (admin). |
| `POST` | `/admin/review-criteria` | Create criterion. |
| `PATCH` | `/admin/review-criteria/:id` | Update criterion. |
| `DELETE` | `/admin/review-criteria/:id` | Delete criterion. |
| `GET` | `/assignments` | List assignments. |
| `POST` | `/submissions/:id/assign` | Assign reviewer. |
| `POST` | `/submissions/:id/start-review` | Start review. |
| `PATCH` | `/assignments/:id/accept` | Accept assignment. |
| `PATCH` | `/assignments/:id/cancel` | Cancel assignment. |
| `GET` | `/analytics/student` | Student analytics. |
| `GET` | `/analytics/reviewer` | Reviewer analytics. |
| `GET` | `/analytics/admin` | Admin analytics. |
| `GET` | `/notifications` | List notifications. |
| `GET` | `/notifications/unread-count` | Unread count. |
| `PATCH` | `/notifications/:id/read` | Mark one read. |
| `PATCH` | `/notifications/read-all` | Mark all read. |
| `GET` | `/admin/audit-logs` | Audit log (admin). |

List responses follow:

```ts
{
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
```

---

## Authentication and authorization

1. The API sets an HTTP-only session cookie on login.
2. `useGetMe()` queries `/auth/me`; query key `["user"]`.
3. `AuthGuard` wraps the entire dashboard group and redirects unauthenticated users to `/login`.
4. `RoleGuard` wraps each role layout (`ADMIN`, `REVIEWER`, `STUDENT`) and renders `AccessDenied` for unauthorized roles.
5. Logout clears the TanStack Query cache and redirects to `/login`.

Client-side guards improve UX; the API remains the source of truth for authorization.

---

## Submission lifecycle

```text
DRAFT
  -> SUBMITTED
  -> IN_REVIEW
  -> CHANGES_REQUESTED -> RESUBMITTED -> IN_REVIEW
  -> APPROVED
  -> REJECTED
```

Status changes are recorded with actor, timestamp, and optional note in `statusHistory`. Related events create notifications and audit log entries.

---

## Review criteria

Reviews score each criterion from 1 to 10:

- Code quality
- Functionality
- UI/UX
- Responsiveness
- Accessibility
- Documentation

The reviewer also records an `APPROVED`, `REJECTED`, or `CHANGES_REQUESTED` decision and written feedback. The overall score is calculated from the criteria.

---

## Design system

- **shadcn/ui** with the `radix-lyra` style and `neutral` base color.
- Design tokens are CSS variables in `src/app/globals.css` and mapped through Tailwind's `@theme inline`.
- Dark theme is the default; `.light` overrides activate the light palette. `ThemeToggle` switches at runtime via `next-themes`.
- Sharp, square corners (`rounded-none`) and hairline borders give the UI a technical, editorial feel.
- Utility classes such as `eyebrow`, `tnum`, `bg-grid`, and `bg-grid-fade` support consistent typography and backgrounds.
- Layouts are responsive from mobile through wide desktop, with a collapsible sidebar and sticky dashboard header.

Add new primitives with the shadcn CLI, which reads `components.json`:

```bash
bunx shadcn@latest add <component>
```

---

## Conventions

- Use the `@/` import alias for everything under `src`.
- Keep server/API logic out of components; put it in `src/api` and `src/hooks`.
- Use TanStack Query for all remote state; avoid ad-hoc `fetch` in components.
- Use `react-hook-form` + `zod` for forms and show validation through `FieldError`.
- Use the shared state components (`LoadingState`, `ErrorState`, `EmptyState`, skeletons) instead of bespoke loading text.
- Use `PageHeader`, `DataToolbar`, and `DataPagination` for list pages so layout stays consistent.
- Prefer existing shadcn primitives over custom markup.
- Run `bun run check` before committing.

---

## Deployment

The app is a standard Next.js deployment and can be hosted on Vercel, a Node server, or a container.

1. Set `NEXT_PUBLIC_API_URL` in the hosting environment.
2. Build with `bun run build`.
3. Start with `bun run start` (or let the platform run Next.js).
4. Ensure the API allows the deployed origin for CORS and cookies (`SameSite`, `Secure` as appropriate).

Because the API URL is public, it is inlined at build time. Rebuild after changing it.

---

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Requests fail with CORS or 401 | `NEXT_PUBLIC_API_URL`, API CORS origins, and cookie settings. |
| Redirect loop on login | `/auth/me` response shape and API session cookie. |
| Empty dashboards | Seed data in the API or sign in with a seeded demo account. |
| Styles look unstyled | Tailwind is imported through `src/app/globals.css`; verify the `@import` chain and restart the dev server. |
| Type errors after pulling | Run `bun install`, then `bunx tsc --noEmit`. |

---

Built with care for structured, fair project reviews.
