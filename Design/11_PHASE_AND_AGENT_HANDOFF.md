# 11 — Phased Delivery and AI Agent Handoff (PLAN ONLY)

**Approved:** Catholic theme, standalone `OnlineChurch` repository, vetted reuse from OnlinePagoda.
**G0 baseline accepted for TASK-001** following Owner 'tiếp tục' 2026-11-17. Final artwork, later tasks and operating deployment require separate acceptance.

## G0 — Design gate (SA + Owner)
- **COMPLETED 2026-11-17:** `OnlineChurch` initialized and GitHub connector access verified.
- SA commits the Design snapshot on `sa/catholic-design-v1` and opens its draft PR for Owner review.
- Owner's continuation accepts the recommended 2.5D + Marian concept, free commands, neutral gifts and optional voice as a baseline. SA adopts **single active production LIVE** by default; actual audio/port and final art are deferred to relevant later acceptance gates.
- **TASK-001 can now be created and reviewed.** Its Developer should only begin after PR #1 is merged or Owner authorizes the specific branch as the base.

## Phased tasks — TASK-001 prepared; later tasks not yet assigned
| ID | Responsibility | Scope | Acceptance |
|---|---|---|---|
| TASK-001 | AI Code | standalone scaffold, test/build scripts, isolated config and `@onlinechurch/shared` | clean build/typecheck/unit tests; no pagoda runtime coupling |
| TASK-002 | AI Code (parallel to Visual Batch A) | offline PixiJS 9:16 renderer foundation with synthetic shapes, guarded geometry and static DEMO | safe empty/missing-art fallback, tests, localhost preview; NO production Catholic assets |
| TASK-002B (later) | AI Visual then AI Code | integrate Owner-approved Batch A/B 2.5D artwork, accurate protected regions and votive stand | registered alpha layers, hash/license manifest, Owner content approval and actual camera-mask overlap tests |
| TASK-003 | AI Code | ChurchEngine: entrance, seats, free prayer and virtual votive candles | stable actors, fair queue, no paid access |
| TASK-004 | AI Code | TikTok connector adaptation, reconnect, gift-streak finalization | room/stale/duplicate/unknown-gift tests |
| TASK-005 | AI Code | dashboard, neutral Vietnamese TTS, audio ownership, quiet/pause | correct name, fallback, moderation and operator UX |
| TASK-006 | AI Code + Owner | Windows Electron capture, stress rehearsal and mobile audio QA | safe 9:16, independently running from Pagoda |
| TASK-007 | SA + Owner | code review, release/rollback and real-LIVE approval | all gates + manual Owner acceptance |

## Roles and token-efficient execution
- **SA:** primarily writes `Design/`; after sign-off, writes narrowly scoped `Task/` with read-first paths, allowed paths, acceptance, branch name and tests; commits; reviews GitHub PRs using separate `ReviewPR/PR-n/` if local checkout available. Critical defects -> REQUEST_CHANGES + Task fix list; on accepted & Owner-merged PR -> clean reviewer-owned scratch and completed Task only.
- **AI Code / Codex:** implements one Task/PR at a time in OnlineChurch only. No source changes in Pagoda, no modifications to Design/Task, no real LIVE during automated tests. Returns compact changed-files/commit/tests PASS-FAIL-NOT_RUN evidence, screenshot for UI, risks and rollback.
- **AI Visual/Audio (separate ChatGPT):** reads `Design/06_VISUAL_AUDIO_BRIEF.md` and `Design/09_CATHOLIC_CONTENT_AND_SAFEGUARDS.md`. Produces original concept art, 2.5D/PNG layers with transparency, characters/poses and asset manifest; no application source edits or GitHub push without explicit authorization.
- **Owner:** selects religious/visual content, approves Design and final go-live; merges accepted PRs.

## Context savings
Each AI task receives only its exact Task, required Design files and source path allowlist. Developers report **deltas** rather than pasting entire codebases. SA reviews changed paths first, then context-sensitive dependencies, not all unrelated folders. Image AI works from a compact visual brief, not hundreds of previous chat messages. Preserve test evidence and report failures accurately.

## Unresolved user decisions
- [x] 2.5D layered art adopted as visual concept.
- [x] Marian side devotional corner adopted as concept; [ ] specific art approved before integration.
- [x] Free enter/prayer/candle, neutral gifts and named TTS accepted as MVP baseline; [ ] exact texts and audio settings before release.
- [x] One active production LIVE at a time is the safe MVP operating assumption; [ ] simultaneous LIVE on the PC requires separate future hardware/audio acceptance.

## Follow-up after first PR (2026-11-17)
- TASK-001: Developer PR #2 **merged** 2026-11-17 and its active Task was closed in `15_TASK001_CLOSEOUT.md`.
- Visual AI: Concept 03 is the chosen direction, not production art. Next deliver **Batch A** (true layered 1080×1920 registered architecture) and plan relocation of votive interaction as specified in `13_CONCEPT03_SA_VISUAL_REVIEW.md`; no source integration before the next Task/art sign-off.
- Tests: Owner may run designated full verification instead of having AI Code repeat every command, but failures must return to Developer. See `14_OWNER_EXECUTED_TEST_POLICY.md`.

- **After PR #2 and #3 merge:** TASK-002 is restricted to renderer scaffolding and synthetic geometry. The later asset integration is separately authorized as TASK-002B after Visual Batch A/B review. No silent change of TASK-003 ChurchEngine scope.

- TASK-002 was prepared on SA branch `sa/task002-renderer-foundation` **for Owner merge review**. Its strict scope is static offline PixiJS scaffolding with abstract mock shapes and fail-closed protected geometry. Visual Agent Batch A independently proceeds. A separate TASK-002B integrates vetted real PNG/geometry after SA+Owner visual approval; no approved artwork is claimed by TASK-002.

## Fast-track amendment after TASK-002 merge / Visual PR #6 R1
- Code PR #7 is MERGED. TASK-002 archived; `TASK-003` now means **TASK-003A state-machine/synthetic actors** rather than the entire ChurchEngine in one risky change. Free prayer/votive behavior is reserved for later scoped TASK-003B.
- Parallel Visual Batch C creates sprite sets for walk, sit, kneel, transitions. Batch B supplies side Marian/votive as a separate content-approved workflow.
- Next code order is actor diagnostic -> parallax/advanced safe masks -> approved art/free actions -> gifts -> operator dashboard -> long soak -> offline TikTok-adapter validation -> Owner go-LIVE gate. See `18_FASTTRACK_ROADMAP_AND_VISUAL_BATCH_C.md`, which controls dates/order over the former coarse TASK-004 through TASK-007 table above. No live streaming until Owner's explicit approval.
