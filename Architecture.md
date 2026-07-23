# Architecture Document - Architecture Freeze v1.0

## 01 Folder Structure
Monorepo using Turborepo.
```
/
├── apps/
│   ├── web/               # Next.js App Router (User interface, Admin Dashboard)
│   └── api/               # NestJS Backend (Core logic, REST API, Stream Proxy)
├── packages/
│   ├── core/              # Shared TS interfaces, validation schemas (Zod)
│   ├── ui/                # Shared React UI (Design System - Tailwind/Radix)
│   └── database/          # Prisma schema, migrations, seed scripts
├── docs/                  # Architecture specifications
└── package.json           # Root workspace
```

## 02 Tech Stack
- **Frontend:** Next.js (React 18+), Tailwind CSS, Radix UI, Zustand (client state).
- **Backend:** NestJS (Node.js/TypeScript).
- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Caching & Queues:** Redis (via BullMQ for background jobs).
- **Video Player:** Custom implementation wrapping `<video>` API for maximum control.

## 03 Component Diagram
```
[ Client Browser ] <--> [ Cloudflare CDN (Edge Cache & WAF) ] <--> [ Next.js Web App ]
                                                                        |
                                                                        v
                                                          [ NestJS API Gateway ]
                                                       /         |              \
                                                      /          |               \
                        [ Auth/RBAC Service ]  [ Media/Search Service ]  [ Streaming/Provider Service ]
                                |                        |                            |
                          [ Redis Session ]     [ Postgres DB ]              [ IStorageProvider ]
                                                [ Redis Cache ]                       |
                                                                          (Google Drive / S3 / R2)
```

## 04 API Architecture
- **Protocol:** REST over HTTPS, `/api/v1/`.
- **Contracts:** Defined via Zod schemas in `packages/core`, strictly validated at runtime.
- **Pagination:** Offset/Limit based for UI grids, Cursor-based for infinite scroll.
- **Standard Response Envelope:**
  ```json
  { "data": { ... }, "meta": { "total": 100, "page": 1 }, "error": null }
  ```
- **Standard Error:**
  ```json
  { "data": null, "error": { "code": "UNAUTHORIZED", "message": "Invalid token" } }
  ```
- **Endpoints (Subset):**
  - `GET /media` (Filters: `?genre=action&sort=-createdAt&page=1&limit=20`)
  - `GET /media/:id`
  - `GET /stream/:id` (Requires auth/token. Returns 206 Partial Content).
  - `POST /admin/media` (RBAC: Admin only).

## 05 Database
**PostgreSQL (Prisma ORM)**
- **Normalization & Auditing:** All tables include `id` (UUID), `createdAt`, `updatedAt`, `deletedAt` (Soft delete), `createdBy` (FK to User).
- **Entities:**
  - `User`: `id`, `email`, `passwordHash`, `role` (ADMIN, USER), `settings`.
  - `Media`: `id`, `title`, `description`, `posterUrl`, `duration`, `status` (DRAFT, PUBLISHED), `viewCount`. Indexed on `title` (pg_trgm for fuzzy search), `status`, `createdAt`.
  - `MediaSource`: `id`, `mediaId`, `provider` (GOOGLE_DRIVE, S3), `providerFileId`, `quality`, `size`.
  - `WatchHistory`: `id`, `userId`, `mediaId`, `progressSeconds`, `completed`.
  - `Playlist` & `Collection`: For grouping media.
  - `AuditLog`: `id`, `userId`, `action`, `entityType`, `entityId`, `payload`.

## 06 Services & Storage Abstraction
- **IStorageProvider Contract:** Completely isolates logic.
  ```typescript
  interface IStorageProvider {
    name: string;
    getMetadata(fileId: string): Promise<MediaMetadata>;
    getStream(fileId: string, range?: string): Promise<Readable>;
    getSignedUrl(fileId: string, expiresInSeconds: number): Promise<string>;
  }
  ```
- **Google Drive Implementation:** Handles OAuth tokens internally, translates provider API errors to standard API errors, handles 429 rate limit backoffs.

## 07 Caching Strategy
- **Edge (CDN):** Static assets, Next.js static pages.
- **Redis (App Level):**
  - Media metadata cache (TTL: 1h).
  - Google Drive Auth Tokens.
  - Trending calculations (updated via cron).
- **Browser:** LocalStorage for player preferences (volume, subtitles).

## 08 Authentication & Security
- **Auth:** JWT access tokens (short-lived, 15m), HttpOnly/Secure refresh tokens (7 days).
- **RBAC:** Middleware validates roles (`@Roles('ADMIN')`) against JWT claims.
- **Link Security:** Stream endpoint uses ephemeral tokens generated just-in-time, tied to user IP/Session to prevent hotlinking.
- **Headers:** Helmet applied for CSP, X-Frame-Options, HSTS. CORS strictly limited to allowed origins. Rate limiting via Redis.

## 09 Streaming Architecture
- **Resumable Playback:** Player sends heartbeat to `/api/v1/history/progress`. On load, player fetches progress and sets `video.currentTime`.
- **Proxy Behavior:** Backend requests `Range` from Google Drive. Streams data directly to client `Response`.
- **Timeout/Retry:** Backend implements 5s timeout on provider requests and 3 retries with exponential backoff.
- **Graceful Degradation:** If stream proxy fails, fallback to error state in UI; do not crash the app.

## 10 Search & Recommendation
- **Search:** Postgres Full-Text Search with `pg_trgm` extension for typo-tolerance.
- **Trending:** Background cron job calculates moving average of views over 24h, caching result in Redis.
- **Recommendations:** MVP relies on shared tags/genres and basic "Users who watched X also watched Y" SQL queries.

## 11 Deployment & CI/CD
- **Environments:** Preview (Vercel PRs), Production.
- **CI/CD (GitHub Actions):**
  - Lint/Format (ESLint/Prettier).
  - Typecheck (tsc).
  - Test (Jest Unit/Integration, Playwright E2E).
  - Security (Dependabot, npm audit).
- **Rollback:** DB migrations mapped carefully. Stateless app allows immediate image rollback.
- **Disaster Recovery:** Daily RDS snapshots. Config stored in AWS Secrets Manager.

## 12 Monitoring & Observability
- **Logging:** Structured JSON (Pino). Shipped to Datadog.
- **Metrics/Tracing:** Datadog APM tracing API routes and DB queries.
- **Health Checks:** `/health` endpoint checking DB connection, Redis, and Storage Provider status.