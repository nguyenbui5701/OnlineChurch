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
| TASK-002 | AI Visual then AI Code | original Catholic 9:16 assets, layered scene and sanctuary mask | licensed manifest, Owner image review and protected zone |
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
- TASK-001: Developer PR #2 is open; code review posted; Owner final Windows/UAT checks and merge decision pending. SA must not remove task file yet.
- Visual AI: Concept 03 is the chosen direction, not production art. Next deliver **Batch A** (true layered 1080×1920 registered architecture) and plan relocation of votive interaction as specified in `13_CONCEPT03_SA_VISUAL_REVIEW.md`; no source integration before the next Task/art sign-off.
- Tests: Owner may run designated full verification instead of having AI Code repeat every command, but failures must return to Developer. See `14_OWNER_EXECUTED_TEST_POLICY.md`.
