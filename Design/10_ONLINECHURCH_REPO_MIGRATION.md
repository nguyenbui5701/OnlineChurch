# 10 — Standalone Repository Migration Record and Technical Reuse

**Decision D-01:** APPROVED 2026-11-17 — independent `nguyenbui5701/OnlineChurch` with isolated runtime.

## Current migration state
- `OnlineChurch` exists, with GitHub push/admin access verified 2026-11-17.
- Repository initialized by SA with README on `main` (commit `d1ae6cf24db40303748d211e8daac3380b0522f2`).
- SA branch `sa/catholic-design-v1` contains the migrated Design documents for Owner review. **Design review remains open; no application code has been ported.**
- Provenance: documents originated from `OnlinePagoda` temporary staging branch `sa/onlinechurch-design-v0`, most recent source commit `a5be3c8aebdc6c638807ef4b2d8b3fc0195804e1`.
- After verification of the new Design draft PR, the temporary OnlinePagoda PR #1 should be closed without merging.

## Future project-of-record directory contract
```text
OnlineChurch/
  Design/                 # SA-owned and reviewed documentation
  Task/                   # only active authorized implementation tasks
  ReviewPR/               # ignored disposable reviewer worktree, NEVER committed
  apps/server/src/        # ChurchEngine, TikTok adapter, voice services
  apps/overlay/src/       # PixiJS Catholic scene + sanctuary mask
  apps/dashboard/src/     # operator UI
  packages/shared/src/    # @onlinechurch/shared contracts
  assets/                 # original/licensed media with manifest
  tests/                  # deterministic fixtures
  scripts/                # standalone build/capture
  .env.example            # public sample without credentials
  README.md
```
This layout is a **proposal**, not approval to copy the full old repository.

## Technical reuse matrix — pinned reference
Old source: `nguyenbui5701/OnlinePagoda@ee55ee81e507135b805d116586f5814eed9a89a9`.

| Old reference | Future action | Required evidence |
|---|---|---|
| `apps/server/src/tiktok/{mapper,provider,transport,worker}.ts` | PORT selectively | validation, room scope, combo dedupe and reconnect unit tests |
| `apps/server/src/sources.ts` | ADAPT | separate DEMO/LIVE ChurchEngine |
| `apps/server/src/app.ts` | ADAPT | isolated local server, Socket.IO, origin & audio owner controls |
| `apps/server/src/voice32.ts` | ADAPT | neutral Catholic-scene thanks and separate TTS cache |
| `apps/overlay/src/main.ts` | ADAPT rendering pattern | new Catholic scene and protected sanctuary polygon |
| `apps/dashboard/src/*.tsx` | ADAPT UI control pattern | operator panels with no pagoda wording |
| `packages/shared/src/*` | REWRITE | independent `@onlinechurch/shared` schemas and types |
| `apps/server/src/engine.ts`, incense/fortune/lantern | **NO WHOLESALE PORT** | new ChurchEngine; no Buddhist rituals |
| `apps/overlay/public/art`, temple audio | **DO NOT PORT by default** | original/licensed Catholic art and audio |

### Provenance and copyright gate
Every selected module port requires original path + pinned SHA + license verification + rewritten target path + test evidence. Do not assume copied media rights because both repositories share an owner.

## Runtime isolation and rollback
- Suggested Windows workspace `D:\\Vibecode\\OnlineChurch`, and proposed port 3100 (**not yet measured**). All env, data, build, logs, cache and Electron capture window title belong only to OnlineChurch.
- Pagoda continues independently on port 3000; never touch its source, `.env`, build, runtime data or process during this project.
- First development release starts offline DEMO, not a real TikTok connection. Before LIVE, prove church start/stop/build does not affect Pagoda.
- No `Task/` created until remaining G0 choices are approved, Design PR reviewed and Owner authorizes implementation.
