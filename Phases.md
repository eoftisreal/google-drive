# Implementation Phases - Architecture Freeze v1.0

## Phase 1: MVP (Minimum Viable Product)
**Focus:** Core monorepo setup, DB schema, API contracts, Storage Abstraction, basic playback.
- **Infrastructure:** Turborepo, Next.js, NestJS, Prisma, PostgreSQL setup. Zod validation boundaries.
- **Database Skeleton:** Implement full schema (Users, Media, MediaSource, AuditLogs) with migrations.
- **Storage Abstraction:** Implement `IStorageProvider`. Write Google Drive provider handling auth and byte-range streams.
- **Backend API:** Implement `/api/v1/media` (CRUD) and `/api/v1/stream/:id` with proxy logic.
- **Frontend Core:** Basic Next.js layouts, Tailwind config.
- **Player (V1):** Custom React wrapper around `<video>` supporting Play/Pause, Seek, Volume, Fullscreen. Connects to secure stream API.
- **Admin (V1):** Hidden/basic UI to ingest Google Drive IDs. No RBAC yet (hardcoded auth).

## Phase 2: Core UX & Security
**Focus:** RBAC, Admin Dashboard, Player Enhancements, Accessibility.
- **Security:** Implement JWT Access/Refresh tokens, RBAC roles. CSRF and Helmet protections.
- **Admin Dashboard:** Full UI for metadata editing, moderation, and viewing audit logs.
- **Player (V2):** Add Picture-in-Picture, Theater mode, keyboard shortcuts, and strict WCAG 2.2 AA accessibility.
- **User Features:** Watch history tracking (progress heartbeat) and resume playback.

## Phase 3: Advanced Media & Discovery
**Focus:** Subtitles, Previews, Search, Recommendations.
- **Subtitles & Previews:** VTT subtitle support, UI for subtitle customization. VTT sprite-sheet based thumbnail previews on seek bar.
- **Search:** Implement Postgres full-text search API and frontend UI.
- **Discovery:** "Continue Watching" row on homepage. Basic "Related Media" recommendation endpoint.

## Phase 4: Production Readiness
**Focus:** Observability, Performance, CI/CD hardening.
- **Observability:** Integrate Datadog (Logs, Traces), configure `/health` checks.
- **Caching:** Implement Redis caching for metadata and API rate limiting.
- **E2E & Load Testing:** Playwright test suites. K6 load testing on streaming endpoint.
- **Disaster Recovery:** Document runbooks, verify automated RDS backups.

## Phase 5: Scaling (Post-MVP)
**Focus:** High concurrency, alternative storage, background jobs.
- **Background Jobs:** BullMQ setup for metadata scraping or thumbnail generation.
- **Storage Expansion:** Implement Cloudflare R2 `IStorageProvider`.
- **Transcoding (Optional):** Evaluate replacing proxy stream with background transcode-to-HLS pipeline.