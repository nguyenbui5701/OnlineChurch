# ONLINE CHURCH — Design Index

> **OWNER DECISION — 2026-11-17:** D-01 **APPROVED**: this standalone `nguyenbui5701/OnlineChurch` repository with independent runtime, selectively adapting OnlinePagoda technology. D-04 **APPROVED**: Catholic (Công giáo) identity. The repository has been initialized; Design migration is in the SA draft PR. Remaining interactions, visuals, rollout and full Design sign-off are pending. See `08_DECISION_LOG.md`.

**Status:** TASK-001 merged and closed; Concept 03 Batch A underway with Visual AI; next technical task prepares the offline renderer foundation; final assets and LIVE remain gated | **Date:** 2026-11-17

## Purpose and boundary
Design a separate interactive **Nhà thờ Online Công giáo** experience for TikTok LIVE on Windows, using `OnlinePagoda` as the **audited technical reference**, not as a theological or visual template. Never modify or restart the existing pagoda LIVE installation in order to test the church project.

### Baseline examined
- Repo: https://github.com/nguyenbui5701/OnlinePagoda
- Reference commit: `ee55ee81e507135b805d116586f5814eed9a89a9` (2026-11-17)
- `apps/server/src/sources.ts`: separate DEMO/LIVE engines and providers.
- `apps/server/src/tiktok/{provider,mapper,transport}.ts`: connector, validation, room binding, reconnect, gift-streak events.
- `apps/server/src/{engine,app,voice32}.ts`: business state, Socket.IO, dynamic thank-you audio.
- `apps/overlay/src/{main.ts,golden/scene.ts}`: PixiJS 1080x1920 stage and church-incompatible Buddhist assets/ceremonies.
- `apps/dashboard/src/main.tsx`: React operator dashboard.
- `packages/shared/src/{index,gifts,live}.ts`: current types/schemas; many are temple-coupled.
- `scripts/build.mjs`, `docs/DEVELOPMENT.md`, `.gitignore`: build isolation and whitelist.

**Audit limitation:** source inspection only; not a local build, test run, TikTok verification, religious consultation, or copyright clearance. Existing README notes production/E2E has not been reverified on a fresh machine.

## Contents
1. [01_REQUIREMENTS.md](01_REQUIREMENTS.md) — scope, user stories, safeguards, non-functional goals
2. [02_UI_UX.md](02_UI_UX.md) — 9:16 LIVE scene and dashboard specifications
3. [03_ARCHITECTURE.md](03_ARCHITECTURE.md) — isolation options, boundaries, data flow
4. [04_EVENT_CONTRACTS.md](04_EVENT_CONTRACTS.md) — interaction model and failure policies
5. [05_AI_WORK_RULES.md](05_AI_WORK_RULES.md) — SA / AI Code / reviewer contracts
6. [06_VISUAL_AUDIO_BRIEF.md](06_VISUAL_AUDIO_BRIEF.md) — handoff to visual/audio agent
7. [07_TEST_RELEASE_GATES.md](07_TEST_RELEASE_GATES.md) — acceptance and LIVE safety
8. [08_DECISION_LOG.md](08_DECISION_LOG.md) — approved decisions and open sign-offs
9. [09_CATHOLIC_CONTENT_AND_SAFEGUARDS.md](09_CATHOLIC_CONTENT_AND_SAFEGUARDS.md) — Catholic content, imagery and devotional boundaries
10. [10_ONLINECHURCH_REPO_MIGRATION.md](10_ONLINECHURCH_REPO_MIGRATION.md) — repository migration record and technical reuse map
11. [11_PHASE_AND_AGENT_HANDOFF.md](11_PHASE_AND_AGENT_HANDOFF.md) — phased tasks and agent handoff
12. [12_VISUAL_AGENT_STARTER.md](12_VISUAL_AGENT_STARTER.md) — concise prompt for separate visual/asset ChatGPT
13. [13_CONCEPT03_SA_VISUAL_REVIEW.md](13_CONCEPT03_SA_VISUAL_REVIEW.md) — Concept 03 selected and correction/asset acceptance plan
14. [14_OWNER_EXECUTED_TEST_POLICY.md](14_OWNER_EXECUTED_TEST_POLICY.md) — Owner/Developer/SA test delegation and evidence
15. [15_TASK001_CLOSEOUT.md](15_TASK001_CLOSEOUT.md) — verified merge, evidence and task closeout

## Phase plan — approved sequencing; each implementation task needs separate review
- **G0:** Standalone Catholic repo and recommended MVP 2.5D + side Marian image + free commands + neutral gifts/voice adopted as implementation baseline through Owner's 'tiếp tục' (2026-11-17). Precise final art and actual simultaneous LIVE setup are not pre-approved.
- **G1:** DEMO scene + visual assets + visitor actions, no TikTok or external TTS dependency.
- **G2:** TikTok event adapter + duplicate/streak safety + operator controls + voice and FX.
- **G3:** Windows separate-instance capture, rehearsal, safeguards, go-live.
- **G4:** optional extensions after actual LIVE observations.

**Task gate:** G0 is accepted as a baseline for **TASK-001 scaffold only**; SA may create it now. Later implementation remains subject to each task's own acceptance, approved assets and PR merge. No code changes are authorized without the Task and Owner-controlled GitHub workflow.

## Safety note
This is an independently authored interactive artwork, **not a real parish/church, clergy, religious service, sacrament, or guaranteed spiritual benefit**. Gifts are optional appreciation and must not buy prayer, blessings, forgiveness, absolution or priority of spiritual care.

## Repository status
- **Project of record:** `https://github.com/nguyenbui5701/OnlineChurch`, initialized with a README on 2026-11-17.
- **This branch:** `sa/catholic-design-v1`, design migration from `OnlinePagoda@a5be3c8aebdc6c638807ef4b2d8b3fc0195804e1`; see `10_ONLINECHURCH_REPO_MIGRATION.md`.
- **Current gate:** Owner merged PR #2 (TASK-001) and #3 (Concept 03/Test policy). TASK-001 archived in Design/15; TASK-002 renderer foundation is being prepared in a new SA PR.
- **Historical staging:** old `OnlinePagoda` draft PR #1 is superseded without merge into its production `main`.

## Next immediate handoff
- TASK-001 code [PR #2](https://github.com/nguyenbui5701/OnlineChurch/pull/2) merged; completed task file removed from active `Task/`. Evidence and outcome in [15 — TASK-001 closeout](15_TASK001_CLOSEOUT.md). No production release.
- Artist input: [12 — Visual AI starter](12_VISUAL_AGENT_STARTER.md). The 2.5D direction is the default, but final images and iconography remain subject to Owner asset acceptance.


- Owner's selected artwork direction: [Concept 03 SA visual review](13_CONCEPT03_SA_VISUAL_REVIEW.md); selected preview is **not** a completed transparent 2.5D asset set.
- Testing assignment: [Owner-executed QA policy](14_OWNER_EXECUTED_TEST_POLICY.md); no test may be silently skipped or declared PASS without real output.
