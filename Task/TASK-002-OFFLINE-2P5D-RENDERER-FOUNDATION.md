# TASK-002 — Offline 2.5D PixiJS Renderer Foundation (NO Production Art)

**Project:** `nguyenbui5701/OnlineChurch`
**Phase:** G1-B | **Owner:** AI Code | **Priority:** P0 | **Branch:** `feature/TASK-002-offline-renderer-foundation`
**Status:** PREPARED BY SA for Owner to review/merge. Do not implement until this Task exists in OnlineChurch `main` or Owner explicitly authorizes the exact SA branch as base.
**Depends on:** TASK-001 merged, head of OnlineChurch main includes code PR #2 (`0b5df414...`) and design PR #3 (`ce996084...`).
**In parallel:** AI Visual is creating Concept 03 **Batch A**. Do not wait for its assets to build this infrastructure; equally, **do not integrate any unapproved image** in this task.

## 1. Goal

Turn the current isolated HTML placeholder into a **real locally rendered PixiJS canvas** with a stable logical `1080×1920` (9:16) stage, an extensible 2.5D render-layer tree and independently testable **fail-closed spatial guard foundation**. Use **synthetic primitive artwork only** (simple abstract arcs, rectangles, empty aisle/pew placeholders, safety debug shapes). Deliver a runnable **offline DEMO visual preview** with no TikTok, no TTS, no ChurchEngine game actions and no religious or external artwork.

This subdivides the original planned visual task:
- **TASK-002 (this Task):** renderer and safe geometry infrastructure; **no production assets**.
- **TASK-002B (future separate Task):** actual approved Concept 03 Batch A/B PNG layers, Catholic depictions, precise sacred mask, side votive stand/camera alignment and art-license integration after Visual Agent + Owner/SA approval.
- **TASK-003 (unchanged):** ChurchEngine user entrance, seats, symbolic prayer and virtual candle actions; not part of this Task.

## 2. Mandatory read-first

From the currently merged `OnlineChurch/main`:
1. `Design/README.md`
2. `Design/08_DECISION_LOG.md`
3. `Design/02_UI_UX.md` (1080×1920 composition / UX safe zones)
4. `Design/03_ARCHITECTURE.md` (PixiJS renderer separated from domain)
5. `Design/05_AI_WORK_RULES.md`
6. `Design/07_TEST_RELEASE_GATES.md`
7. `Design/13_CONCEPT03_SA_VISUAL_REVIEW.md` (concept approved, assets held; candle redesign)
8. `Design/14_OWNER_EXECUTED_TEST_POLICY.md`
9. `Design/15_TASK001_CLOSEOUT.md`
10. `Design/visual/SA_CONCEPT03_HANDOFF.md` and `manifest_CONCEPT03_PROPOSAL.csv` (future inventory **only**, not production assets).
11. Existing code: `apps/server/src/{app,placeholder,index,config}.ts`, `packages/shared/src/index.ts`, `scripts/{build,build-path,demo-smoke}.mjs`, root `package.json`, `tsconfig.json` and current tests.

Read-only technical reference if necessary: `OnlinePagoda@ee55ee81e507135b805d116586f5814eed9a89a9`. No source/runtime writes there; no copying religious media or ceremonies.

## 3. Strict file allowlist for Developer PR

**May change or create:**
- `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts` (only as needed for browser build/tests).
- `apps/overlay/package.json`, `apps/overlay/index.html`, `apps/overlay/src/**`, `apps/overlay/vite.config.ts` **if** Vite chosen.
- `packages/shared/src/**` only for **pure shared geometry/layout types** and/or a small, versioned read-only renderer contract; do not break TASK-001 event/command/snapshot schemas.
- `apps/server/src/app.ts`, `apps/server/src/placeholder.ts` and narrowly required `apps/server/src/**` for safe static artifact serving; keep existing `/health` and `/api/demo/state` unchanged in payload and semantics.
- `scripts/build.mjs`, `scripts/build-path.mjs`, `scripts/demo-smoke.mjs`, any directly required `scripts/*.mjs`.
- `tests/**/*.test.ts`, `tests/fixtures/**`; optional `tests/visual/**` only for deterministic local/browser fixtures (no external media).
- `docs/DEVELOPMENT.md`, `docs/TECHNICAL_PROVENANCE.md`.

**Prohibited edits:** `Design/`, `Task/`, `ReviewPR/`, `.gitignore`, root `README.md`, `OnlinePagoda`, any user/Visual AI supplied `assets/**`, real religious images, voice, personal data, production configuration, .env. Do not create a new global runtime service or port or change existing server privacy boundaries without an approved amendment. If paths beyond allowlist are needed, ask SA for a scoped change before writing.

## 4. Implementation contract

### A. Single-server offline overlay
- Maintain **one** OnlineChurch local server bound to `127.0.0.1` and default port `3100`. Preserve the existing root placeholder page and both JSON endpoints byte-for-byte in field semantics.
- Add an explicitly documented URL, preferably `http://127.0.0.1:3100/overlay/`, to view the rendered 9:16 stage, plus a discoverable link on root placeholder. No extra externally listening Vite server in final DEMO workflow.
- Build browser assets (PixiJS v8 or compatible version, exact package versions pinned in lockfile) into `OnlineChurch/dist/**`; server serves **only allowlisted generated files** with appropriate MIME and CSP. Never serve repository files by a user-controlled pathname; protect traversal and symlink/junction escapes. No external CDN/fonts/network requests or TikTok accounts.
- A fresh `npm.cmd run build` then `npm.cmd run dev:demo` (or `node .\\dist\\server.mjs`) should show the overlay. If the built browser artifact is absent, the overlay shows a clean **503/"build required"** message and health endpoints remain operational; no crash and no unsafe development fallback. Document any required order.
- Preserve existing `APP_BUILD_DIRECTORY` confinement: outputs stay under `dist/**` in this repo. Validate **each** new overlay output and its parent(s) before writing and serving; a guarded `server.mjs` alone is insufficient. No recursive cleanup, and no writes to OnlinePagoda.
- Build only npm-installed, audited and locally bundled dependencies; document license and new dependency footprint.

### B. 1080×1920 canvas and 2.5D slots
- Actual PixiJS canvas with logical coordinates `1080×1920`, correct resize-to-fit scaling (no stretched 9:16 distortion), high-DPI safe handling and predictable teardown/remount on resize/reload. Avoid uncontrolled render-ticker/DOM listeners.
- Render **clearly labeled abstract demo-only geometry**, not flat Concept 03 as an image. Establish stable layer order and configurable node slots:
  1. far nave/windows placeholder
  2. static sanctuary placeholder (never actionable)
  3. floor and distant pews
  4. **future visitor** layer (empty by default)
  5. foreground pew occluders
  6. **future FX** layer (empty by default)
  7. UI/disclosure layer
  Slots may be mapped to the approved concept ordering, but no image/actor/gift should appear until a later Task.
- Display a readable `DEMO / Offline` status and `Không gian mô phỏng — không phải Thánh lễ hay bí tích` with high contrast. Respect provisional top safe band y=0..150 and footer y=1770..1920; final LIVE Studio safe-zone check belongs to later tasks.
- Show optional **debug guide lines/polygons** in DEMO (not actual holiness/certification). The original preview's `941×1672` image, opaque upscaled PNG, concept technical overlay JPG and unreviewed Batch A outputs must not be loaded as production assets.

### C. Geometry guard API and deny-by-default behavior
- Define a small **pure, tested 1080×1920 geometry module** (no dependence on PixiJS) representing points, polygons, occupied bounds, allowed navigation/FX regions and protected regions. It will be reused by future actual asset integration.
- Include explicit **design-time synthetic polygons** separate from final sacred masks. Their metadata `status:"SYNTHETIC_DEMO_ONLY"` must remain visible in code/docs. **Do not claim these are the final sanctuary/Mary/crucifix masks.**
- APIs should be safely callable to validate candidate placement, transform logical coordinates to/from resized viewport, test protected-region intersection including touching boundary, and **reject nonfinite, negative-dimension, outside-canvas, missing/invalid-mask, or overlapping placements**. Handle near-boundary floats deterministically. Prefer polygon intersection and point-in-polygon with documented edge semantics; avoid relying on a screenshot alone for safety.
- **Fail closed:** when final approved zone data is unavailable or invalid, no visitor/candle/gift sprite, donor label or FX is eligible for rendering. It is acceptable to show static debug background and a clear `MASKS NOT APPROVED — DEMO ONLY` indicator. No interaction bypass.
- No actual actor logic, pathfinding, gift mapping or action queues; those belong to later tasks. If an optional small test marker demonstrates a safe location, it must be labelled synthetic and **not** treated as a real actor or operation; no payment/spiritual command.
- Explicitly prevent passing conceptual overlay coordinates as final runtime safety data. Future finalized polygons and asset hashes require a new Task and Owner/SA review.

### D. Tests and regression
- Unit-test geometry with boundary touch, a thin overlap, wholly-contained/intersecting polygons, invalid/self-intersecting or empty geometry, NaN/Infinity, viewport coordinate transform/resizing, default-deny without approved zone records, and valid synthetic diagnostic regions. Avoid unsupported claims that screenshot masks guarantee runtime safety.
- Preserve all TASK-001 tests (previous Developer report 107/107). `GET /health` and `GET /api/demo/state` must remain deterministic, no LIVE. Existing port 3000 rejection, EADDRINUSE handling, build path confinement and owned-child shutdown remain intact.
- Add offline smoke assertions for GET overlay index and script bundle (content types, correct local-only delivery and no root traversal), with server bound only to loopback; test build-missing graceful response if appropriate. No real TikTok/CDN requests.
- Browser canvas rendering and screenshot are **Owner Windows UAT** if no automated browser available; include instructions for checking it visually. A browser run MUST actually be performed by Owner/Developer before claiming a visible rendered canvas PASS. A successful HTTP 200 or unit test alone is insufficient to claim WebGL rendering.

## 5. Acceptance gates (explicit executor)

| Gate | Runner | PASS criterion |
|---|---|---|
| B01 | AI_CODE targeted + OWNER_WINDOWS full | Strict `npm.cmd run typecheck`; existing types not broken |
| B02 | AI_CODE targeted + OWNER_WINDOWS full | `npm.cmd test` all old+new suites green, no regression of old 107 tests |
| B03 | OWNER_WINDOWS (or AI Code with evidence) | `npm.cmd run build`; generated overlay and server all under safe `dist/**` |
| B04 | AI_CODE or OWNER_WINDOWS | `npm.cmd run demo:smoke`: health/state and overlay static route pass, owned child teardown |
| B05 | AI_CODE | Geometry unit suites: denied overlap/invalid/missing masks, transformation, touched boundaries |
| B06 | AI_CODE | Build/server path security tests reject traversal, linked outputs and exposed non-allowlist files |
| B07 | OWNER_WINDOWS UAT | Actual browser renders 9:16 PixiJS canvas and disclosure on loopback `/overlay/` (no console errors) |
| B08 | OWNER_WINDOWS UAT | Resize browser and verify 9:16 aspect ratio without stretches/cutoff; useful screenshot if possible |
| B09 | AI_CODE static + SA review | No production art, names, actors, voice, TikTok connector, gifts, or online network dependencies |
| B10 | AI_CODE + SA review | Source/Task paths allowlisted, OnlinePagoda untouched; no secrets, dist tracked files or staged external media |
| B11 | OWNER_WINDOWS manual | `Ctrl+C` only OnlineChurch, verify port released/old Pagoda process unaffected if running |
| B12 | OWNER sign-off | UAT results acknowledged; PR created **only after explicit Owner order**; no LIVE deploy |

**No test is optional by wording:** if executor cannot run a gate, mark `NOT RUN` and state whether it blocks completion. Do not describe Owner-submitted evidence as AI-executed. AI Code must run targeted tests after fixes; Owner may run the full suite to save token usage. Failed acceptance stays open on the same Developer branch/PR, no false PASS. Recheck current PR head SHA after fixes.

## 6. Windows workflow and handoff

1. Owner merges the SA Design/Task PR containing TASK-002. Developer fetches `OnlineChurch/main`, confirms current baseline SHA, creates `feature/TASK-002-offline-renderer-foundation`.
2. Developer implements small isolated changes, commits coherently, runs targeted tests and an actual build/smoke where tool access permits. Do not repeatedly run long full suites if Owner explicitly takes them.
3. Developer supplies these PowerShell commands to Owner for full Windows verification **from their OnlineChurch checkout on the correct feature branch** (not OnlinePagoda):

```powershell
Set-Location D:\Vibecode\onlChurch
git branch --show-current
git rev-parse --short HEAD
npm.cmd ci
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run demo:smoke
npm.cmd run dev:demo
```

Then Owner opens `http://127.0.0.1:3100/overlay/`, checks visual and resize, and stops only the demo terminal with Ctrl+C. Avoid running `npm.cmd ci` while the same working-copy DEMO is in use. If local path differs, use actual clone path; above is the last reported development checkout.
4. Owner reports concise PASS totals or failing command + last ~30 output lines, along with browser result and head SHA; no large logs or speculative status.
5. Only after Owner explicitly requests PR: AI Code pushes and opens **one PR** against `OnlineChurch/main`, with changed paths, SHA, tests by executor, known gaps, rollback. SA reviews in an isolated read-only checkout when available, otherwise GitHub diff; Owner merges.
6. **No production deployment, no TikTok LIVE, no changes to OnlinePagoda.**

## 7. Mandatory PR report
- Task link, branch, baseline/head SHA, each changed file, dependency/license/provenance and source of visual placeholders (original primitive code).
- `PASS / FAIL / NOT RUN` for B01–B12 with executor, command/screenshot and concise evidence.
- Side-by-side explanation that synthetic masks are **not** final Catholic sacred polygons, that Batch A work is separate, and that no religious art was introduced.
- State exact build output routes and security properties; how to rerun `demo:smoke`, browser preview, remove only generated OnlineChurch files and rollback only this PR.
- Report next dependency as **Owner-approved Visual Batch A/B → future TASK-002B**.

**Non-goals and deferred work:** original 2.5D alpha assets, exact depiction of Christ/Mary, actual side votive stand artwork, protected sacred final polygon JSON, real visitor movements, queue/events, gifts, prayer/candle interaction, overlay TTS, Studio/window capture, benchmarks, production LIVE. Passing TASK-002 does NOT approve any of these.
