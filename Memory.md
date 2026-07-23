# Project Memory - Architecture Freeze v1.0

## Architecture Decisions (ADRs)
- **ADR-001 (Monorepo setup):** Turborepo with Next.js (Frontend) and NestJS (Backend API/Proxy).
- **ADR-002 (Storage Abstraction):** `IStorageProvider` interface defined. Google Drive is MVP implementation. Code must never assume Google Drive structure outside of its specific module.
- **ADR-003 (Database Schema):** PostgreSQL with Prisma. Soft deletes (`deletedAt`) and Auditing (`createdBy`) are mandatory for enterprise readiness.
- **ADR-004 (Streaming Proxy):** Backend NestJS proxies byte-range requests. This hides Drive URLs and circumvents CORS, at the cost of server bandwidth.
- **ADR-005 (State Management):** Zustand for complex client state (Player), React Query / SWR for API data fetching to handle caching and pagination gracefully.

## API Contracts & Conventions
- All APIs live under `/api/v1/`.
- Responses MUST wrap data: `{ data: T, meta?: PaginationMeta, error: null }`.
- Errors MUST use structure: `{ data: null, error: { code: string, message: string } }`.
- Pagination: Use `page` and `limit` query params. Max `limit` is 100.

## Business Rules & Constraints
- **Zero Direct Exposure:** Raw Google Drive URLs must never reach the client network payload.
- **Strict Role Checking:** Endpoints mutating data require `ADMIN` role.
- **Rate Limits:** Google Drive has strict limits. The backend must implement a Circuit Breaker / Retry-Backoff strategy in the provider layer.

## Future Decisions (Deferred)
- **HLS Transcoding:** Deferred to Phase 5. MVP relies on robust progressive download via HTTP 206 Partial Content.
- **Elasticsearch/Meilisearch:** Deferred. MVP utilizes Postgres `pg_trgm` for sufficient full-text search performance up to ~100k records.

## AI & Developer Instructions
- **Strict Adherence:** Code generation MUST match `Rules.md`. Any violation of `Architectural.md` constraints requires a prior review and ADR update.
- **Validation:** Always define Zod schemas in `packages/core` first, then generate TypeScript types from them (`z.infer`).
- **No Mocks in Prod:** Use actual provider implementations or fail gracefully. Do not commit dummy data APIs to `main`.