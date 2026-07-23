# Rules Document - Architecture Freeze v1.0

## Coding Rules
- **Modularity:** SOLID principles. Services must not depend directly on controllers.
- **Immutability:** Use functional updates in React state (`setParams(prev => ...)`). No direct DOM manipulation outside of specific Player refs.
- **Error Handling:** All API errors must be thrown as custom NestJS Exceptions that map to the standard error envelope. Do not leak internal stack traces.

## Folder Rules
- **Frontend (`apps/web`):**
  - `app/` (Next.js routing)
  - `components/` (Feature specific UI)
  - `hooks/` (Custom logic)
  - `lib/` (Utilities, API clients)
- **Backend (`apps/api`):**
  - `src/modules/[feature]/` (contains `.controller.ts`, `.service.ts`, `.module.ts`).
  - `src/common/` (Guards, interceptors, filters).

## Naming Rules
- **Files & Folders:** `kebab-case` (e.g., `media-player.tsx`).
- **Variables/Functions:** `camelCase`.
- **Classes/Interfaces:** `PascalCase`. Interfaces prefixed with `I`, Types with `T`.
- **Database Tables (Prisma):** PascalCase for models (`Media`), camelCase for fields.

## Git Rules
- **Branching:** `main` (prod), `develop` (staging), `feature/[ticket-id]-[short-desc]`.
- **Commits:** Conventional Commits required. Pre-commit hooks via Husky (lint-staged).

## TypeScript Rules
- `strict: true`. No `any`. Use `unknown` and Type Guards.
- Validation must occur at boundaries (API endpoints, DB writes) using Zod.

## Security Rules
- **Secrets:** Environment variables only. Validated at startup using Zod in NestJS config.
- **Sanitization:** All API inputs validated via NestJS `ValidationPipe` and Zod.
- **Tokens:** Access tokens must expire in <= 15 minutes.

## Performance Rules
- **Frontend Optimization:** Target LCP < 2.5s, CLS < 0.1. Use Next.js `<Image>` strictly.
- **Backend Optimization:** DB queries must only select needed fields (`prisma.media.findUnique({ select: { id: true }})`). No N+1 query problems.

## Accessibility Rules (WCAG 2.2 AA)
- Semantic HTML (`<main>`, `<article>`, `<nav>`).
- Minimum 4.5:1 contrast. Focus rings mandatory on interactive elements (`focus-visible`).
- Screen reader text for icon buttons (`<span className="sr-only">Play</span>`).

## Testing Rules
- **Unit (Jest):** >80% coverage for services and utilities.
- **Integration (Supertest):** All API endpoints must have happy and unhappy path tests.
- **E2E (Playwright):** Core journeys (Auth, Watch Video, Admin Upload) covered.

## Review Rules
- PRs require 1 human approval and passing CI.
- Code changes must link to PRD/Architecture docs if modifying constraints.