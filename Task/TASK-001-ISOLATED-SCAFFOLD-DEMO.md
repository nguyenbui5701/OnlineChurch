# TASK-001 — Isolated TypeScript Scaffold & Offline DEMO

**Project:** `nguyenbui5701/OnlineChurch` (Catholic virtual church for TikTok LIVE).
**SA status:** **READY FOR AI CODE AFTER DESIGN/TASK PR MERGE**.
**Priority:** P0 | **Phase:** G1-A (scaffold only) | **Task branch:** `feature/TASK-001-isolated-scaffold-demo`.
**Owner approval:** Product baseline accepted 2026-11-17 via Owner's "tiếp tục" after SA recommended MVP; **this task is not authorization to connect to real TikTok, deploy or reuse real church art**.
**Prerequisite:** Owner merges [OnlineChurch PR #1](https://github.com/nguyenbui5701/OnlineChurch/pull/1) or explicitly authorizes AI Code to base from that precise SA commit. Developer must not code against a missing `Task/` in old `main`.

## 1. Goal and why TASK-001 exists

Create the **smallest standalone executable TypeScript workspace** for `OnlineChurch`, with stable `@onlinechurch/shared` contracts, minimal HTTP server and an **offline deterministic DEMO**, plus Windows/npm build/typecheck/test/smoke scripts. Establish that it can run and shut down without reading, starting, stopping, importing from or overwriting `OnlinePagoda` before porting any TikTok, TTS or art code.

**Not this task:** Catholic scene graphics, actor animations, votive candle animation, actual TikTok connector/gift streaming, gTTS, Electron Window Capture, credential/auth UI, real pagoda/church media, livestream, visual quality measurement or Windows production launchers. These are separate reviewed tasks.

## 2. Mandatory read-first, do not change these files

Read in this order **from the target merged OnlineChurch commit**:
1. `Design/README.md` — project baseline and stage gates.
2. `Design/08_DECISION_LOG.md` — G0 MVP and operating constraints.
3. `Design/03_ARCHITECTURE.md` — isolation boundaries and ChurchEngine future shape.
4. `Design/04_EVENT_CONTRACTS.md` — normalized events/command semantics.
5. `Design/01_REQUIREMENTS.md` — free actions, privacy, safeguards.
6. `Design/05_AI_WORK_RULES.md` — branch/PR/reviewer ownership.
7. `Design/07_TEST_RELEASE_GATES.md` — TASK-001 specific acceptance.
8. `Design/09_CATHOLIC_CONTENT_AND_SAFEGUARDS.md` — forbidden practices.
9. `Design/10_ONLINECHURCH_REPO_MIGRATION.md` — code provenance and do-not-port list.

**Reference only (READ, never WRITE):**
- `nguyenbui5701/OnlinePagoda@ee55ee81e507135b805d116586f5814eed9a89a9`: `package.json`, `scripts/build.mjs`, `docs/DEVELOPMENT.md` and `packages/shared/package.json`. Understand Node >=22.12, npm workspaces, TypeScript, esbuild/Vite/Vitest approach. **Do not copy the whole project**. Never depend on `../OnlinePagoda` or original `@vuonsen/*` packages.

## 3. Allowed changes — STRICT ALLOWLIST

Developer may **create** these new paths in the OnlineChurch repository and then maintain them within this task:
- Root: `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, `.env.example` (no secrets; may be omitted if not needed).
- `apps/server/package.json`, `apps/server/tsconfig.json` (if needed), `apps/server/src/**`.
- `apps/overlay/package.json`, `apps/overlay/src/**`, `apps/overlay/index.html`, `apps/overlay/vite.config.ts` (optional minimal 9:16 placeholder only).
- `apps/dashboard/package.json`, `apps/dashboard/src/**`, `apps/dashboard/index.html`, `apps/dashboard/vite.config.ts` (optional minimal operator placeholder only).
- `packages/shared/package.json`, `packages/shared/src/**`.
- `scripts/build.mjs`, `scripts/demo-smoke.mjs` and additional minimal `scripts/*.mjs` directly required for this task.
- `tests/**/*.test.ts`, `tests/fixtures/**`.
- `docs/TECHNICAL_PROVENANCE.md`, `docs/DEVELOPMENT.md` (document build/readme commands, without changing root README).

**No other writes**, including `Design/`, `Task/`, `ReviewPR/`, `.gitignore`, root `README.md`, OnlinePagoda source or test fixtures, and no commit of `dist/`, `data/`, `.env`, credentials, `node_modules/` or caches. If a required path is missing from this allowlist, stop and propose the smallest amendment to SA; do not silently expand scope.

## 4. Required technical decisions

### 4.1 Workspace and dependencies
- Node.js **>=22.12**; npm workspaces `apps/*` and `packages/*`; TypeScript strict, ESM and deterministic npm lockfile. Package scopes use `@onlinechurch/server`, `@onlinechurch/overlay`, `@onlinechurch/dashboard`, `@onlinechurch/shared`.
- Use only minimal audited dependencies: TypeScript/Vitest/tsx plus Express or Node HTTP for the server, Zod for validated contracts if useful; add Vite only for an explicitly built static placeholder. Avoid heavyweight Electron, Python/TTS, `tiktok-live-connector`, socket client/server unless necessary for a documented basic contract, and all TikTok authentication.
- Provide scripts: `typecheck`, `test`, `build`, `dev:demo`, `demo:smoke`. Optional `dev` alias must remain DEMO-only. Do not add auto-LIVE behavior.
- A clean Windows PowerShell environment can use `npm.cmd` rather than relying on PowerShell `npm.ps1`.

### 4.2 Offline DEMO server
- Default host `127.0.0.1`, **proposed** port `3100` (from `PORT` env, validate 1–65535); **never** use port 3000 by default. If port in use, fail with a clear EADDRINUSE-style error and no attempt to terminate any external process.
- No network calls to external systems at runtime or from tests; DEMO works with no .env/TikTok credentials/FFmpeg/Python.
- Minimum HTTP endpoints:
  - `GET /health` -> valid JSON with `app:"onlinechurch"`, `ok:true`, `mode:"DEMO"`, `liveConnected:false`. Do not claim LIVE ready.
  - `GET /api/demo/state` -> versioned typed state, `source:"DEMO"`, `scene:"PLACEHOLDER"`, `actors:[]`, `candles:[]` and monotonic `revision` (initially 0). No user/personal data.
- Server must support clean shutdown on SIGINT/SIGTERM and no persistent cross-repo files. If a placeholder HTML page is implemented, identify prominently `DEMO — Không gian mô phỏng, không phải Thánh lễ`, keep 1080×1920 conceptual aspect ratio; no religious image assets needed.
- Do **not** implement full ChurchEngine actions or new game mechanics in TASK-001. Typing interfaces and fixture helpers are enough; real actors/prayer/candles are TASK-003.

### 4.3 Shared typed contracts
At minimum define and unit-test:
- `SourceMode = "DEMO" | "LIVE"`; runtime **always** DEMO for TASK-001.
- `ChurchIntent = "ENTER" | "PRAY" | "LIGHT_CANDLE" | "PEACE" | "AMEN"`; no paid variant.
- Sanitized `NormalizedEvent` envelope fields: schema/version, source mode, room/session/event identifiers, stable actor key, kind and timestamp; examples must not contain real TikTok profiles.
- `ChurchSnapshot` initial state and version/revision, actors/candles arrays, and future-safe forward compatibility.
- Pure command-normalization helper for `vào nhà thờ`, `xin chỗ`, `cầu nguyện`, `thắp nến`, `bình an`, `amen`; support Vietnamese with and without accents and collapse whitespace/case. Invalid/unrecognized/long text yields a safe no-op; no raw chat speech.
- Avoid large theological scripts, raw prayer content, price/coin calculations or gift effects. Add future-facing types only where justified, not speculative hundreds of fields.

### 4.4 Build and file isolation
- Build to `dist/` in **OnlineChurch only**. Optional `APP_BUILD_DIRECTORY` may override to a **validated path inside the OnlineChurch repository**; reject external paths (including `../OnlinePagoda`) before any write. Avoid symlink escapes when cleaning outputs.
- All destructive cleanup confined to known generated paths under the root; never use broad `taskkill /IM node.exe`, `git clean -fdx` on shared workspace or kill process on port 3000.
- `npm.cmd run demo:smoke` should start an isolated listener (prefer ephemeral/explicit test port), query HTTP health/state using timeouts, assert DEMO/no LIVE, terminate **its own** child and exit nonzero on any failure. No residual process.
- `docs/TECHNICAL_PROVENANCE.md` records precisely which OnlinePagoda **patterns** influenced setup and pins `ee55ee81...`; indicate original code files copied = **none**, unless explicitly necessary and reviewed. Document all production dependencies and license statuses without guessing.

## 5. Required tests / acceptance table

| ID | Must demonstrate | Fail condition |
|---|---|---|
| A01 | `npm.cmd ci` reproducible from lockfile after developer's initial install | missing/dirty lock, unresolved dependencies |
| A02 | `npm.cmd run typecheck` PASS in strict TS | compiler warnings/errors masked or skipped |
| A03 | `npm.cmd test` PASS, unit cases for schema/normalization/invalid input | accepted malformed commands, unexpected side effects |
| A04 | `npm.cmd run build` PASS using separate OnlineChurch dist | build path outside project or pagoda overwritten |
| A05 | `npm.cmd run demo:smoke` PASS: /health, /api/demo/state and teardown | connector/network used, residual process or fake PASS |
| A06 | HTTP binds loopback by default; configurable port & EADDRINUSE gracefully handled | binds all network interfaces, kills unrelated process |
| A07 | No `tiktok-live-connector`, gTTS, Python or Electron in this task | real connector/import/credentials or rites copied |
| A08 | No imported code or runtime dependency on OnlinePagoda and no shared mutable directory | cross-repo imports/files, `@vuonsen/*` names |
| A09 | Demonstrate attempts to set build dir outside OnlineChurch rejected before writes | path traversal or unvalidated delete |
| A10 | PR diff only approved allowlist; root Design/Task/README intact, no secrets/caches/assets | unexpected changed files, falsely reported test result |

Additional tests: both accented/unaccented Vietnamese command variants, uppercase/multiple spaces, unknown inputs, overlong strings, valid/invalid schema and safe JSON output. Use at least one invalid input test for every public boundary.

## 6. Execution sequence for AI Code
1. Ensure `OnlineChurch/main` includes this task and Design; create `feature/TASK-001-isolated-scaffold-demo` from updated `main`. If PR #1 not merged, **do not start** without explicit Owner branch-base authorization.
2. Implement small cross-platform workspace and contracts; do not port full OnlinePagoda implementation.
3. On Windows PowerShell: `node --version`, `npm.cmd --version`, `npm.cmd install` for initial lock, then verify clean `npm.cmd ci`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run demo:smoke`.
4. Demonstrate separate repo/bind/port and build-path rejection **without interacting with running Pagoda**. State any machine-only test as NOT RUN if unavailable.
5. Commit all and only allowed files and open PR **against OnlineChurch/main**. Do not merge or deploy.

## 7. PR handoff required by SA

AI Code PR description must include:
- Baseline and head commit SHA, task link, file list with reason, dependency/license summary and provenance.
- Commands with exact shell/environment and actual terminal output; table PASS / FAIL / NOT RUN and error details, **no fabricated PASS**.
- Snapshot of `GET /health` and `GET /api/demo/state`; screenshot optional only if HTML placeholder exists.
- Verification of local port separation, no Pagoda changes and no TikTok/TTS dependencies.
- Known limitations, rollback: stop only OnlineChurch demo child; revert only OnlineChurch implementation PR if needed.
- Note that Catholic artwork, actual LIVE events, voice, gift reactions, FPS and mobile capture were **NOT RUN**, are later phases, and must not be claimed by TASK-001.

**SA review:** validate diff, static/dynamic tests and directory isolation; REQUEST_CHANGES for any P0/P1 or failed gate; retain task for fixes. APPROVE only after convincing evidence; Owner merges. After Owner-confirmed merge, SA removes this completed Task file in a separate commit as required by `Design/05_AI_WORK_RULES.md`, while retaining PR/Design provenance.
