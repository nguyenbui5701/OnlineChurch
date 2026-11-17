# OnlineChurch development — TASK-002 renderer foundation

Current branch: `feature/TASK-002-offline-renderer-foundation`.
Baseline: `5618bc5741f04920990a54d5df97f4fa53cc4e19` (merged TASK-002 PR #4, including TASK-001 PR #2 and Design PR #3).
Implementation commit: `870f10f` (source + executable tests). Subsequent documentation-only commits record this unchanged implementation's evidence.
TASK-001 notes below are historical evidence; this section is the current workflow.

## What TASK-002 adds

One offline loopback server, still `127.0.0.1:3100`, now serves a PixiJS 8.23.0 canvas at **http://127.0.0.1:3100/overlay/**. The existing root placeholder is preserved with a new overlay link. `/health` and `/api/demo/state` retain the exact fields and semantics of TASK-001, including revision 0 and empty actors/candles.

The logical canvas is 1080×1920. Seven fixed slots establish painter-style depth: far nave/windows, static sanctuary placeholder, floor/distant pews, future visitors, foreground pew occluders, future FX, UI/disclosure. All drawing is original code using abstract arcs, rectangles and polygons. No supplied images, religious depictions, Concept 03 PNG/JPG, names, avatars, candles or gifts are loaded. There is no engine, action input, audio or LIVE ingress.

The visitor and FX containers are **empty and non-renderable**. UI always identifies `DEMO / Offline`, `Không gian mô phỏng — không phải Thánh lễ hay bí tích`, and `MASKS NOT APPROVED — DEMO ONLY`. Guide visibility can be toggled; this does not change admission rules. Logical header y=0..150 and footer y=1770..1920 are reserved for disclosure. These are provisional layout bands, not tested LIVE Studio safe zones.

## Build, run and Windows verification

Stop your existing **OnlineChurch DEMO terminal** with Ctrl+C before `npm.cmd ci` in this checkout. Do not stop any other application. Build browser files before starting DEMO; source mode does not start a separate Vite server and does not watch/rebuild the overlay automatically.

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

Expected branch: `feature/TASK-002-offline-renderer-foundation`. Commands must exit 0; current test count is **176**. Then open **http://127.0.0.1:3100/overlay/**. The built alternative is `node .\dist\server.mjs` after build. This remains offline DEMO. Use Ctrl+C only in its own terminal to stop it.

Optional custom output (same setting for source-mode preview and smoke):

```powershell
$env:APP_BUILD_DIRECTORY = 'dist/uat'
npm.cmd run build
npm.cmd run demo:smoke
npm.cmd run dev:demo
# After stopping your DEMO:
Remove-Item Env:APP_BUILD_DIRECTORY
```

A bundled server remembers its own validated output directory through build-time constants; relative runtime overrides resolve from the checkout, not the caller's current directory. The bundle is intentionally anchored to this checkout for isolation; moving the checkout/artifacts requires rebuilding. Port 3000 remains rejected, the default port remains 3100, and EADDRINUSE does not terminate the occupied listener.

## TypeScript and dependency compatibility

`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, unused-code checks and checked-JS remain enabled for all first-party code in the unchanged root tsconfig. PixiJS declarations have a known local incompatibility: `AbstractBitmapFont.distanceField` is a required union including undefined while its implemented interface declares an optional property. The error was reproduced on 8.23.0 and 8.14.0; no installed package was patched.

`npm.cmd run typecheck` now requires **both** sequential commands to succeed:

1. `tsc --noEmit --skipLibCheck`: all project TS/JS is checked with the existing strict flags, including exact optional properties. Dependency declarations provide their types but their internal consistency is not checked in this pass.
2. `tsc --noEmit --exactOptionalPropertyTypes false`: project and dependency declarations are checked, including library consistency, with only that additional exact-optional flag disabled. All `strict` checks remain enabled.

This is an explicit dependency-typing compatibility exception, not a claim that PixiJS passes exact-optional declaration validation. No `@ts-ignore`, `any` facade, swallowed compiler exit, permanent global `skipLibCheck`, or source-wide relaxation was added. SA should review this documented tradeoff. Runtime validation remains independent. Production adds only PixiJS and its locked dependency tree; full versions/licenses are in `TECHNICAL_PROVENANCE.md`.

## Geometry foundation and deny-by-default behavior

`packages/shared/src/geometry.ts` is pure and has no PixiJS dependency. It provides points, simple polygons, occupied rectangles, synthetic region records, point classification, protected intersection, placement diagnostics and viewport transforms. Original command/event/snapshot contracts are unchanged apart from exporting the new geometry module.

- Polygons must be simple, 3..64 vertices, finite and within 1080×1920. Duplicate vertices, sparse arrays, zero-area geometry, self-intersections and collinear corners are rejected conservatively. A repeated closing vertex is not accepted; the last edge is implicit.
- Touching a protected edge/vertex counts as collision. A fixed **1e-6 logical-pixel** distance tolerance treats near-boundary floats conservatively. Invalid polygon input makes `polygonsIntersect` return true (unsafe); `pointInPolygon` reports `invalid`.
- Bounds require positive width/height greater than the tolerance and must stay wholly on the logical canvas. Placement must lie strictly inside **one** allowed polygon, with no crossing of a concave boundary, and must not touch/intersect any protected polygon. Invalid/missing region records deny diagnostics too.
- `SYNTHETIC_ZONES` in `apps/overlay/src/layout.ts` has `status: "SYNTHETIC_DEMO_ONLY"`. Coordinates were independently authored for debug shapes, **not copied from the Concept 03 planning overlay** and **not final sanctuary/Mary/crucifix masks**.
- `diagnosePlacement` can report geometryAllowed=true for a synthetic diagnostic, but renderEligible is **always false**. `canRenderDynamic` unconditionally denies every kind, including visitors, candle/gift sprites, donor labels and FX. There is no runtime approved-mask loader or string/flag that unlocks it; a forged APPROVED record is not accepted. Final art, hashes, masks and admission require the separate reviewed TASK-002B.
- `fitViewport` uses one uniform scale with centered letterboxing; transforms reject invalid dimensions/forged fits and out-of-canvas points. The actual canvas uses that logical transform and CSS 9:16 sizing, caps devicePixelRatio at 2, and renders on resize/guide changes instead of running a continuous animation ticker. Page hide destroys the owned app, scene, listeners and observer; BFCache restore mounts afresh. Context loss shows a visible message until a render succeeds again.

## Static route and output security

| URL | Generated file | Content type |
| --- | --- | --- |
| `/overlay/` | `dist/overlay/index.html` | text/html |
| `/overlay/app.js` | `dist/overlay/app.js` | text/javascript |
| `/overlay/app.css` | `dist/overlay/app.css` | text/css |
| `/overlay/THIRD_PARTY_LICENSES.txt` | `dist/overlay/THIRD_PARTY_LICENSES.txt` | text/plain |

`dist/server.mjs` is built but never exposed by HTTP. Only the exact URL map above is accepted: no directory listing, decoded pathname joining, query-based file selector, source map, repository file or development fallback. Raw/encoded traversal returns 404. The existing Host/Origin/GET-only protections also apply to the overlay. Missing/partial/unsafe artifacts return **503 build required**, while both JSON endpoints remain available.

Build validates **all five output paths and every parent before its first write**, then revalidates each artifact before writing. Serving repeats directory/file validation on every request, uses a file handle with no-follow where supported, checks regular-file type, hardlink count and an 8 MB size limit. Symlinks/junctions, hardlinks, traversal, external outputs, ambiguous Windows paths and arbitrary artifact names fail closed. Generated HTML verifies its dependent assets exist and are safe before returning 200. Validation does not make the directory safe against a hostile local administrator racing filesystem mutations; the checkout/output directories must remain owner-controlled.

No recursive cleanup. Rebuild replaces only the five known files. If manual removal is needed, stop only OnlineChurch first and remove only those exact generated files under the verified checkout's dist; preserve unrelated outputs, logs and other applications. Never follow a junction to clean a target or use a broad `git clean`/process kill.

CSP permits local script and stylesheet resources, inline styles needed for canvas sizing, and denies network connections, images, fonts and workers. No CDN/fonts or media downloads are requested. PixiJS's `pixi.js/unsafe-eval` entry point installs **non-eval fallback implementations**; CSP does not enable unsafe-eval. This naming and behavior were verified in the installed source. Graphics/text extensions are explicitly registered; external extension/resource loading is unnecessary.

## TASK-002 acceptance evidence by executor

AI_CODE ran on Windows PowerShell with Node v24.16.0 / npm 11.13.0 on 2026-11-17 (Asia/Saigon). Exact terminal logs remain locally ignored in `dist/verification/task002/`. Actual final results:

| Gate | Executor / evidence | Status |
| --- | --- | --- |
| B01 | AI_CODE: `npm.cmd run typecheck`, both strict passes above exited 0; dependency exception documented | PASS |
| B02 | AI_CODE: `npm.cmd test`, **7 files / 176 tests passed**, including all original 107 cases | PASS |
| B03 | AI_CODE: `npm.cmd run build`; server, HTML, JS, CSS and license notice all under this checkout's dist | PASS |
| B04 | AI_CODE: `npm.cmd run demo:smoke`; exact health/state, four overlay routes MIME/body checks, forbidden paths 404, child exit 0 and port released | PASS |
| B05 | AI_CODE: 58 geometry cases, boundary/thin overlap/containment/concavity/invalid data/transform/default-deny | PASS |
| B06 | AI_CODE: 10 new overlay security cases plus 16 existing build tests; per-file hardlinks, parent junction, unsafe output, raw traversal, missing build and host/origin/method guards | PASS |
| B07 | OWNER_WINDOWS: actual visible GPU canvas, disclosure and no console errors not yet reported | NOT RUN — blocks visual acceptance |
| B08 | OWNER_WINDOWS: actual resize/aspect/high-DPI/guide-toggle/browser screenshot not yet reported | NOT RUN — blocks visual acceptance |
| B09 | AI_CODE static scan: original primitives only; no runtime media/profile/TikTok/TTS/gift ingestion or external requests; SA review pending | AI_CODE PASS / SA NOT RUN |
| B10 | AI_CODE allowlist/protected-file/generated-file checks; no OnlinePagoda writes/runtime control; SA review pending | AI_CODE PASS / SA NOT RUN |
| B11 | OWNER_WINDOWS manual Ctrl+C/release for this task not yet reported; automated owned-child teardown passes | NOT RUN — blocks manual acceptance |
| B12 | OWNER sign-off/explicit TASK-002 PR order not yet received | NOT RUN — PR remains gated |

Full test output: `Test Files 7 passed (7)`, `Tests 176 passed (176)`, duration 5.05s. Build output sizes: server 769521 bytes, index 1156, JS 1054282, CSS 1353, license notices 10586. Sizes are evidence for this build, not a performance benchmark. Smoke port 54688 exited/released successfully. HTTP delivery and the Node Pixi scene-tree unit test **do not prove visible WebGL rendering**. No browser automation was attempted for TASK-002; Owner execution is assigned by the Task, and the earlier task's automated browser command was unavailable due execution policy.

## Owner browser UAT — still required

1. Use the correct feature branch/head and commands above. Open `/` first and follow **Mở canvas DEMO 2.5D**, or open `/overlay/` directly. Do not judge an old TASK-001 server still running from another terminal.
2. Confirm an actual canvas with warm abstract arches, static central placeholder, floor/pew rectangles, red protected-debug polygon and navigation/FX guides. No production scene/characters/candles should appear. The loading message should disappear; a WebGL error message means FAIL, not PASS.
3. Confirm `DEMO / Offline`, the Vietnamese disclosure and `MASKS NOT APPROVED — DEMO ONLY` remain readable. Open F12 Console: report errors if any. No external requests should occur in Network; resources are local HTML/JS/CSS only.
4. Resize the browser tall/narrow and wide/short; verify the 9:16 canvas scales uniformly without stretching or cutting off header/footer. At very short viewport heights the page may scroll instead of cropping. If available, try browser zoom / a different DPI monitor. Toggle **Đường hướng dẫn** off/on; disclosure remains and no actor/FX becomes enabled.
5. Reload and navigate back/forward: one canvas, no duplicate drawings or repeated errors. A screenshot is useful evidence if you choose to provide one.
6. Check `/health` and `/api/demo/state` still show DEMO and empty state. Stop only this OnlineChurch terminal with Ctrl+C, then confirm its port is released (or relaunch succeeds). Do not stop/restart OnlinePagoda to test this.
7. Return branch/head, test totals (if run), browser PASS/FAIL, resize PASS/FAIL, Ctrl+C PASS/FAIL, or the failing command plus last 20–40 lines. Do not send credentials or full dependency logs.

No automatic push/PR/merge/deployment is performed for TASK-002. After Owner UAT and an explicit PR order, prepare one PR against main with results attributed to the actual executor. Rollback is limited to stopping OnlineChurch and, when authorized, reverting only this implementation. The next visual dependency is **Owner-approved Visual Batch A/B → future TASK-002B**. TASK-003 actions, final sacred masks, artwork, audio, Studio capture, FPS benchmarks and LIVE remain separate work.

---

# Historical TASK-001 — offline DEMO

Standalone TypeScript scaffold; baseline `f241a76774b5f786709d0915df01a5614af6603f`.
Branch: `feature/TASK-001-isolated-scaffold-demo`.
This task provides validated shared contracts, deterministic empty state, a local HTTP server and a minimal 9:16 placeholder. It does not implement actors, prayers, candles, artwork, LIVE or audio.

## Windows setup and verification

Requires Node.js >=22.12 and npm. Verified with Node v24.16.0 / npm 11.13.0 on Windows PowerShell. Dependency installation needs registry access; development/build/test work after installation without TikTok, accounts, `.env`, Python or FFmpeg.

```powershell
Set-Location D:\Vibecode\onlChurch
npm.cmd ci
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run demo:smoke
```

`npm.cmd ci` uses the committed lockfile. `typecheck` includes strict TypeScript and checked JavaScript scripts. `test` covers schemas, normalization, HTTP boundaries, child lifecycle and build-path isolation. Tests use loopback ports allocated by the OS; port 3000 is never used. The smoke command checks the built artifact, so run build first.

## Run and stop the DEMO

```powershell
npm.cmd run dev:demo
```

Open **http://127.0.0.1:3100/**. Stop this foreground DEMO with **Ctrl+C** in its terminal. To run the production-shaped offline bundle instead:

```powershell
node .\dist\server.mjs
```

This is still DEMO, never LIVE. No production deployment is performed. Host is fixed to `127.0.0.1`; arbitrary HOST settings do not expose it to the network. A busy port produces `EADDRINUSE`, exits nonzero and does not stop the existing listener. Select a different unused port explicitly if needed:

```powershell
$env:PORT = '3101'
npm.cmd run dev:demo
# After Ctrl+C:
Remove-Item Env:PORT
```

PORT accepts decimal integers 1–65535 except reserved port 3000; empty, zero, fractional and malformed values fail startup. Tests may internally request port zero for OS-assigned ephemeral listeners, but the user-facing PORT setting never accepts zero. No port scanning or process termination by name is performed.

## Owner UAT checklist

1. Start DEMO and open the address printed in the terminal. The page shows **“DEMO — Không gian mô phỏng, không phải Thánh lễ”**, a 9:16 placeholder, no connected LIVE, and 0 actors / 0 candles. At narrow widths the page may scroll vertically.
2. Open **Kiểm tra hoạt động** (`/health`). Expect HTTP 200 with:

   ```json
   {"app":"onlinechurch","ok":true,"mode":"DEMO","liveConnected":false}
   ```

3. Open **Xem trạng thái** (`/api/demo/state`). Expect:

   ```json
   {"schemaVersion":1,"source":"DEMO","scene":"PLACEHOLDER","revision":0,"actors":[],"candles":[]}
   ```

4. Refresh several times. State remains deterministic and revision stays 0 because this task has no state-changing actions. Restarting starts the same fresh state; nothing is persisted.
5. While this DEMO is running, run a second `node .\dist\server.mjs` in another terminal with the same PORT. The second process must report `EADDRINUSE`; the first page must still respond. Stop only your own first DEMO with Ctrl+C.
6. Confirm the first terminal reports `OnlineChurch DEMO stopped.` and that its address stops responding. Start again to confirm the port was released.

Report which step failed and the displayed error. No real church imagery, action controls, viewer profiles or gift/voice features should be present in this task. Owner UAT is separate from automated PASS results.

## Shared contracts

- `SourceMode`: DEMO / LIVE vocabulary, while this server always produces DEMO.
- `ChurchIntent`: ENTER, PRAY, LIGHT_CANDLE, PEACE, AMEN; no paid variants.
- `normalizeCommand(unknown)`: only exact `vào nhà thờ`, `xin chỗ`, `cầu nguyện`, `thắp nến`, `bình an`, `amen` after case/diacritic/whitespace normalization. Non-strings, unknown, negated, quoted, combined or >80-code-unit input return `null`; never echo or speak input.
- `NormalizedEventSchema`: schema version 1, source, opaque bounded IDs, room/session, actor, kind (`enter` or `command`), timestamp and command intent when applicable. `parseScopedEvent` validates exact source/room/session and returns null for mismatches. It does not implement dedupe, an engine, or real platform ingestion.
- `ChurchSnapshotSchema`: version 1, nonnegative safe-integer revision, typed bounded actor/candle arrays. `createInitialSnapshot()` returns fresh empty arrays every time.
- Object parsers strip unknown fields, including nested profile/chat data. Additive fields can be ignored by current readers; unknown schema versions and kinds are rejected until explicitly supported. Callers must use parsed output, not re-serialize original input. No raw profiles/chat fields are declared.

## Build and process isolation

`build` bundles the server and Zod to `dist/server.mjs`, including the Zod MIT notice. It performs no directory cleanup. `APP_BUILD_DIRECTORY` may select `dist/uat`, `dist/test-build`, or an absolute path **under this checkout's dist**. This intentionally narrower generated-output policy also protects source files inside the repo. Paths resolve from the repository, independently of caller CWD.

```powershell
$env:APP_BUILD_DIRECTORY = 'dist/uat'
npm.cmd run build
npm.cmd run demo:smoke
Remove-Item Env:APP_BUILD_DIRECTORY
```

External paths, traversal outside dist, source directories, symlink/junction ancestors, ambiguous Windows components and linked/non-file outputs are rejected before writes. Build buffers output in memory and revalidates before writing. No recursive removal, sibling workspace reads, or shared mutable data directories are used. Tests create and remove only their own generated files/junctions under dist; they do not traverse the junction targets for cleanup.

Smoke spawns one direct Node child with a separately chosen loopback port, waits for readiness, checks health and repeated state, requests graceful shutdown over private IPC, awaits exit code 0, then proves the port can be rebound. Timeouts or forced cleanup are failures. On Windows `child.kill` does not deliver POSIX signals gracefully, so private IPC uses the same shutdown path. Unit/integration tests also deliver SIGINT/SIGTERM Node events inside owned children; this does not replace Owner's physical Ctrl+C console UAT. Port reservation has a small release/start race: if another process takes the port, smoke fails safely instead of touching that process.

## Acceptance evidence

Verified on 2026-11-17 (Asia/Saigon), Windows PowerShell, Node v24.16.0, npm 11.13.0. Terminal transcripts from the final verification are local ignored files in `dist/verification/` (`typecheck.log`, `tests.log`, `build.log`, `smoke.log`).

| Gate | Actual command / evidence | Result |
| --- | --- | --- |
| A01 | `npm.cmd ci`: added 44 packages, audited 47, 0 vulnerabilities; lock SHA256 before and after `D3D107D966B973944B403561F4915AB82B893A36B5FFAA081F7186DF4F3F29F8` | PASS |
| A02 | `npm.cmd run typecheck`: `tsc --noEmit`, exit 0 | PASS |
| A03 | `npm.cmd test`: 4 test files, **107 passed**, exit 0 | PASS |
| A04 | `npm.cmd run build`: `D:\Vibecode\onlChurch\dist\server.mjs`, exit 0 | PASS |
| A05 | `npm.cmd run demo:smoke`: health/state match, repeated state unchanged, direct child exited 0, test port 53584 released, exit 0 | PASS |
| A06 | Integration tests: IPv4 loopback bind, explicit port, malformed PORT and EADDRINUSE; actual default listener `127.0.0.1:3100` returned HTTP 200 for health and page | PASS |
| A07–A08 | Manifest/lock/runtime import inspection: no connector, TTS, Python, Electron, pagoda package/import/path or shared runtime directory | PASS |
| A09 | Build-isolation tests invoke actual builds with `../OnlinePagoda`, absolute sibling path, traversal and an external-target junction; all exit 1 before writing. Valid custom `dist/**` output preserves unrelated sentinel | PASS |
| A10 | Diff paths restricted to Task allowlist; Design/Task/root README/.gitignore unchanged against baseline; generated output/cache untracked | PASS |
| Signal handlers | Owned child tests deliver Node SIGINT/SIGTERM events, verify exit 0 and released port; IPC shutdown and parent disconnect also pass | PASS |
| Placeholder delivery | Built server `/` returned HTTP 200, disclosure present, CSP prevents external resources | PASS |
| Browser screenshot / visual inspection | Headless Edge command was rejected by execution policy (`blocked by policy`); no screenshot or rendered-browser PASS claimed | NOT RUN |
| Owner browser UAT | On 2026-11-17 the Owner confirmed the interface appeared in their browser and explicitly requested a TASK-001 PR. Other manual checklist steps were not individually reported; automated evidence remains as above | BROWSER CONFIRMED; PR AUTHORIZED |

Smoke output:

```text
GET /health {"app":"onlinechurch","ok":true,"mode":"DEMO","liveConnected":false}
GET /api/demo/state {"schemaVersion":1,"source":"DEMO","scene":"PLACEHOLDER","revision":0,"actors":[],"candles":[]}
PASS: offline DEMO on 127.0.0.1:53584; owned child exited 0; port released.
```

Initial test run: 103 passed / 2 failed. One failure exposed double-disconnect on parent IPC loss (fixed by checking `process.connected` before disconnect); the other was a Host-header test using fetch, which normalizes Host (fixed to use a raw loopback HTTP request). Added both Node signal-handler tests. Final clean-install run above passes all 107 cases. These were fixes within TASK-001, not acceptance changes.

Changed-file groups for review: root manifests/configs provide the workspace and reproducible toolchain; `packages/shared/src` provides schemas/normalization; `apps/server/src` provides offline HTTP/config/placeholder/lifecycle; `scripts/*.mjs` builds and verifies isolation; `tests/**` holds synthetic fixtures and executable gates; these two `docs/` files record operation, evidence and provenance. No modifications to SA-owned documentation.

## Limits and rollback

The Owner confirmed browser display and authorized PR creation on **2026-11-17**. This is Owner-provided browser evidence, not an automated screenshot or a claim that every manual checklist step was performed. Remaining review is with the Solution Architect; merge is controlled by the Owner. Real artwork, interactive actors/candles, TikTok, TTS, FPS, mobile/Studio capture and production deployment are **NOT RUN — outside TASK-001**. No OnlinePagoda source/build/test/runtime was operated on; its regression/LIVE behavior is not claimed as tested. Its four approved reference files were read remotely at the pinned commit only.

Rollback: stop only the OnlineChurch DEMO terminal with Ctrl+C. No persisted application data needs migration. If reverting code is later authorized, revert only the OnlineChurch implementation commits; preserve Design/Task and other applications. No PR, push, merge or production release is performed without the Owner's workflow authorization.
