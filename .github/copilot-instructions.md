# Copilot Instructions for `server`

## Build, test, and lint commands

- Install deps: `bun install`
- Start dev runtime (watch mode): `bun run dev`
- Full test command (current): `bun run test`  
  Note: this currently exits with `"Error: no test specified"`.
- Single-test command: not configured yet in this repo. Add a real test runner script first (for example, `test:single`) before attempting targeted test execution.

## High-level architecture

- Runtime entrypoint is `src/index.ts`; it currently boots infrastructure by calling `connectDB()` from `src/utils/db.ts`.
- Persistence uses MongoDB via Mongoose models in `src/models/*` (`User`, `Goal`, `Task`, `Todo`, `Session`, `Analytics`, etc.), with references across entities using `ObjectId` and `ref`.
- Business/data access logic is organized in repository classes under `src/repository/*` (for example `UserRepository`, `GoalRepository`) rather than placing DB logic directly in controllers.
- DTO/payload validation and typing are defined with Zod schemas in `src/schema/*`, and repository methods parse outgoing DTOs through schema parsers.
- Logging and cross-cutting utilities are centralized in `src/utils/*`: `AppLogger` (Pino singleton), DB connection helper, JWT helpers, and shared error handlers.
- Domain errors are explicit custom classes in `src/types/errors.ts` and are propagated (not silently swallowed).

## Key conventions in this codebase

- Use repository-layer methods as the primary interface to model operations; keep controllers thin.
- When returning entities externally, map Mongoose docs to DTOs and validate with Zod (`userDTO.parse(...)` pattern in `UserRepository`).
- Follow existing error handling style: throw `InvalidError`/`EnvironmentError` for known failures, log via `AppLogger`, then rethrow.
- Keep domain status values aligned with the established enum set used across models: `"todo" | "doing" | "done" | "not doing"`.
- Environment-based config is expected for core services (`MONGODB_URL`, JWT settings used in `src/utils/jwtUtils.ts`), and missing values should fail fast.
- Preserve Bun-first workflow and TypeScript ESM settings from `package.json`/`tsconfig.json` (`module: ES2022`, `types: ["bun-types"]`).
