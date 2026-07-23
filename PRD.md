# Product Requirements Document (PRD) - Architecture Freeze v1.0

## 01 Vision
To build a highly scalable, general-purpose media streaming platform providing a robust, seamless, and high-performance video playback experience. The platform will completely abstract the underlying storage infrastructure, enabling secure and efficient streaming of owned or authorized media from various providers, starting with Google Drive and scaling to cloud-native storage solutions like S3, R2, and B2.

## 02 Goals
- **Storage Abstraction:** Zero-friction transitions or extensions to enterprise storage via strict `IStorageProvider` isolation.
- **Scalability & Performance:** High concurrent traffic handling, rapid time-to-first-byte (TTFB < 500ms), and uninterrupted streaming.
- **Extensibility:** A unified foundation for media delivery, accommodating custom player plugins, multi-tenant features, and diverse media.
- **Maintainability:** An impeccable standard for developers and AI via rigorous documentation, strict linting, and automated testing.
- **Accessibility:** Full compliance with WCAG 2.2 AA standards across all interfaces.

## 03 Requirements
### Core Platform
- **Media Management (Admin):** Ingest, index, and moderate video metadata. Comprehensive RBAC for user/admin roles.
- **Playback & Streaming:** Advanced custom web player with progressive download, resumable playback, and extensive user controls.
- **Security & Authorization:** Token-based stream protection, link hotlink prevention, strict CORS, CSP, and rate limiting.
- **Discovery & Analytics:** Full-text search, recommendation engine, watch history, and administrative analytics.

## 04 Functional Requirements
- **FR1 - Storage Integration:** Connect via `IStorageProvider`. Google Drive is the MVP provider. Must not expose provider details to the frontend.
- **FR2 - Video Playback:** Player must support Play/Pause, Volume, Seek, Fullscreen, PiP, Theater mode, chapters, subtitle customization, playback speed, and resume playback.
- **FR3 - Media Catalog & Admin:** Dashboard to manage media, edit metadata, manage users (RBAC), view audit logs, and configure system settings.
- **FR4 - Subtitles & Previews:** Support for `.vtt`/`.srt`, thumbnail preview tracks (VTT-based sprite sheets).
- **FR5 - User Features:** Watch history, continue watching, favorites, playlists, and collections.
- **FR6 - Search & Recommendations:** Title/description search with typo tolerance, trending calculations, and basic collaborative filtering for related media.
- **FR7 - API Layer:** Versioned REST endpoints (v1) with strict request/response contracts, pagination, filtering, sorting, and structured error formatting.
- **FR8 - Background Jobs:** Asynchronous handling for metadata scraping, thumbnail generation, and eventually transcoding via message queues.

## 05 Non Functional Requirements
- **NFR1 - Architecture:** Monorepo with Next.js (App Router) Frontend and NestJS Backend. Event-driven queue architecture for background tasks.
- **NFR2 - Performance:** API resolves metadata in < 100ms. Player TTFB < 500ms. UI load < 1.5s (LCP).
- **NFR3 - Availability:** 99.9% uptime target, with graceful degradation (e.g., if search is down, direct media links still work).
- **NFR4 - Security:** CSRF protection, HttpOnly refresh tokens, short-lived JWTs, CSP headers, rate-limiting on auth/stream routes.
- **NFR5 - Accessibility:** WCAG 2.2 AA compliance natively enforced by design system.
- **NFR6 - Disaster Recovery:** Automated daily DB backups. Defined operational runbooks for rollback and data migration.

## 06 Use Cases
- **UC1 - Admin Manage Media:** Admin uploads Google Drive ID, system queues background job to fetch metadata and generate sprites, saving to normalized DB.
- **UC2 - User Watches Video:** User clicks media. System checks auth, fetches cached metadata, player mounts, and stream is fetched securely via backend proxy resolving byte-ranges. Player resumes from last watched position.
- **UC3 - Platform Migration:** Admin configures Cloudflare R2 credentials. New media defaults to R2 provider. Player streams from R2 transparently without UI changes.

## 07 User Stories
- **US1:** As an Admin, I need audit logs for all metadata changes to ensure moderation accountability.
- **US2:** As a User, I want to use keyboard shortcuts (Space, Arrow keys, F) to control playback seamlessly.
- **US3:** As a User, I want to customize subtitle font size and background opacity for better readability.
- **US4:** As a Developer, I need fully typed API contracts and structured error responses so I can integrate frontend safely.

## 08 Acceptance Criteria
- All API responses adhere to the standard envelope and pagination schema.
- Database utilizes soft-deletes (`deletedAt`) and auditing fields (`createdAt`, `updatedAt`, `createdBy`).
- Streaming proxy correctly handles timeouts, byte-range requests, and retries.
- CI/CD pipeline enforces 80% coverage and WCAG 2.2 AA accessibility checks.

## 09 KPIs
- **Video Start Failures:** < 1% error rate on video playback initiation.
- **Average TTFB:** Time to first frame < 500ms on broadband.
- **Buffering Ratio:** Time spent buffering vs playing < 5%.
- **API Latency:** p95 response time < 200ms.
- **LCP (Largest Contentful Paint):** < 2.5s for frontend pages.

## 10 Future Scope (Post-MVP)
- Dynamic Transcoding pipeline (HLS/DASH) for adaptive bitrate.
- Advanced Recommendation engine via machine learning.
- Mobile Native Apps (React Native) consuming the same v1 API.
- Multi-Tenant SaaS (Bring-your-own-storage).
