# OnlineChurch TASK-001 — offline DEMO

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
| Owner UAT | Follow checklist above; waiting for Owner results | PENDING |

Smoke output:

```text
GET /health {"app":"onlinechurch","ok":true,"mode":"DEMO","liveConnected":false}
GET /api/demo/state {"schemaVersion":1,"source":"DEMO","scene":"PLACEHOLDER","revision":0,"actors":[],"candles":[]}
PASS: offline DEMO on 127.0.0.1:53584; owned child exited 0; port released.
```

Initial test run: 103 passed / 2 failed. One failure exposed double-disconnect on parent IPC loss (fixed by checking `process.connected` before disconnect); the other was a Host-header test using fetch, which normalizes Host (fixed to use a raw loopback HTTP request). Added both Node signal-handler tests. Final clean-install run above passes all 107 cases. These were fixes within TASK-001, not acceptance changes.

Changed-file groups for review: root manifests/configs provide the workspace and reproducible toolchain; `packages/shared/src` provides schemas/normalization; `apps/server/src` provides offline HTTP/config/placeholder/lifecycle; `scripts/*.mjs` builds and verifies isolation; `tests/**` holds synthetic fixtures and executable gates; these two `docs/` files record operation, evidence and provenance. No modifications to SA-owned documentation.

## Limits and rollback

Owner UAT is **PENDING**. Real artwork, interactive actors/candles, TikTok, TTS, FPS, mobile/Studio capture and production deployment are **NOT RUN — outside TASK-001**. No OnlinePagoda source/build/test/runtime was operated on; its regression/LIVE behavior is not claimed as tested. Its four approved reference files were read remotely at the pinned commit only.

Rollback: stop only the OnlineChurch DEMO terminal with Ctrl+C. No persisted application data needs migration. If reverting code is later authorized, revert only the OnlineChurch implementation commits; preserve Design/Task and other applications. No PR, push, merge or production release is performed without the Owner's workflow authorization.
