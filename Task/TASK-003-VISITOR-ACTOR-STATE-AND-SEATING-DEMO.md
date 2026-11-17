# TASK-003 — Visitor Actor Simulation: Walk, Sit, Kneel, Stand (Offline DEMO)

**Project:** OnlineChurch | **Owner:** AI Code | **Phase:** G1-C | **Priority:** P0
**Status:** READY FOR OWNER DESIGN/TASK REVIEW; implement only **after SA PR containing this file is merged to main**, unless Owner explicitly permits work from its exact SHA.
**Implementation branch:** `feature/TASK-003-visitor-actor-state-demo`
**Depends on:** PR #7 TASK-002 merged at `caac0f299efea15454d3b0241dda871fa26420d9`.
**Visual track:** PR #6 R1 at `c2b71b4b4ae04c00a594eb9179054289b817c4fd` accepted as **review reference**, not production art; separate AI Visual Batch C produces actor sprites. **Do not import VisualReview art or candidate masks.**

## 1. Objective and scope rationale

Deliver a **deterministic, bounded, local-only visitor simulation** that demonstrates ordinary fictional church visitors entering, WALKING along a diagnostic aisle, reserving a pew, SITTING, STANDING, KNEELING quietly at a permitted diagnostic area, RETURNING TO SEAT and LEAVING. Prioritize believable movement mechanics, pivots, choreography, seat occupancy, cancellation and repeatability, so an approved sprite atlas can replace temporary shapes in a later Task without rewriting the actor engine.

This is **TASK-003A, the motion/seat slice** of originally planned ChurchEngine. Do **not** implement real prayer/candle/gift actions, TikTok live ingestion, speech, TTS, true religious artwork or final masks. Schedule free prayer/candle semantics and authenticated room/session state in separate TASK-003B or later SA task. Avoid spending time on features not essential to a visual action walkthrough.

## 2. Read first
- `Design/README.md`, `02_UI_UX.md`, `03_ARCHITECTURE.md`, `04_EVENT_CONTRACTS.md`, `05_AI_WORK_RULES.md`, `07_TEST_RELEASE_GATES.md`, `08_DECISION_LOG.md`, `09_CATHOLIC_CONTENT_AND_SAFEGUARDS.md`, `11_PHASE_AND_AGENT_HANDOFF.md`, `14_OWNER_EXECUTED_TEST_POLICY.md`, `17_TASK002_CLOSEOUT.md`, `18_FASTTRACK_ROADMAP_AND_VISUAL_BATCH_C.md`.
- `Design/13_CONCEPT03_SA_VISUAL_REVIEW.md`, `16_VISUAL_REVIEW_REPO_WORKFLOW.md`; Visual PR #6 is **read-only reference** and remains Draft.
- Source on current `main`: `apps/overlay/src/{main,scene,layout,style}.ts`, `packages/shared/src/{geometry,index}.ts`, `apps/server/src/{app,index}.ts`, `scripts/{build,demo-smoke}.mjs`, current tests.
- Original OnlinePagoda baseline `ee55ee81e507135b805d116586f5814eed9a89a9` may be read as pattern reference; **never** edit/copy wholesale.

## 3. STRICT file allowlist

Only these OnlineChurch paths may be created/changed:
- `apps/overlay/src/**`, `apps/overlay/index.html` for a clearly labelled **development-only** actor diagnostic UI and render adapter.
- `apps/server/src/**` **only if required** for a read-only DEMO scenario endpoint; **no new public APIs** and preserve `/health` and `/api/demo/state` exact existing semantics. Prefer no server change.
- `packages/shared/src/**` for pure actor state, seating, simulation ticks, action fixture types and **synthetic-only** geometry navigation helpers. Keep existing Task-001 contracts and Task-002 fail-closed geometry API backward-compatible.
- `tests/**/*.test.ts`, `tests/fixtures/**`; `scripts/*.mjs` only for scoped build/smoke support.
- `package.json`, `package-lock.json`, `tsconfig.json` only if genuinely required (justify any dependency; prefer none).
- `docs/DEVELOPMENT.md`, `docs/TECHNICAL_PROVENANCE.md` only for test/UAT/handoff.

**Forbidden:** any `Design/`, `Task/`, `VisualReview/`, production `assets/`, `ReviewPR/`, root `README.md`, `.gitignore`; OnlinePagoda files/runtime; credentials, TikTok/TTS services, real religious imagery or gift-to-prayer features, production deployment scripts. Request SA amendment if essential files fall outside the allowlist.

## 4. Domain state machine and deterministic simulation

### Actor model and transitions
- Pure actor model contains `actorKey` as sanitized synthetic fixture ID, room/session DEMO scope, reserved `seatId`, logical **foot anchor** (x,y), facing, speed, gesture progress, current state, transition deadline, revision. No PII/raw usernames, no direct gift prices/spiritual rank.
- States at minimum: `OUTSIDE`, `ENTERING`, `WALKING_TO_SEAT`, `TURNING`, `SITTING_DOWN`, `SEATED`, `STANDING_UP`, `WALKING_TO_REFLECTION`, `KNEELING_DOWN`, `KNEELING_HOLD`, `GETTING_UP`, `RETURNING_TO_SEAT`, `LEAVING`, `EXITED` (names may vary but distinct **transitional motion phases** mandatory).
- Actions are **free** and deterministic: `DEMO_ENTER`, `DEMO_SIT`, `DEMO_REFLECT`, `DEMO_RETURN`, `DEMO_LEAVE`, `DEMO_RESET`. No blessing/sacrament, no formal Mass, no actual gift or candle.
- ENTER route from lower aisle toward assigned pew; transition SIT only after foot anchor reaches a reserved sit pose. REFLECT leaves seat only when a non-sacred diagnostic reflection point is available; walk, turn, kneel, hold short (default <=8 seconds), stand and return. Leave releases reservation after exit or explicit cancellation. Never kneel mid-walk or clip through pew.
- Fixed step clock `tick(dtMs)` (bounded, validated) with deterministic sampling; **no Date.now/random/raf used in pure model**; seeded synthetic fixtures if random-looking entry order required. Source room/session future integration must not be spoofed.
- User-triggered duplicate ENTER does not duplicate actors, seats or queues. Rapid conflicting requests are rejected/deferred with explicit reason; transitions are interruptible only at safe points, RESET is immediate and leak-free.
- Occupancy candidate 24 simultaneous DEMO visitors by default, configurable max <=60 for test. All scheduled queues/counters bounded and independently resettable. No fairness favoring gifts; free action never requires gifts.

### Routes/seats/foot anchors
- Use **ONLY** synthetic diagnostic polygons defined in code, never import PR #6 `masks/candidate_zones_NOT_APPROVED.json` or assume the scene's sanctuary polygons are approved. The currently empty/non-renderable `visitors` and `fx` production slots MUST remain locked.
- Provide a pure fixture map of aisle walk routes, side reflection zone, seat slots `{id,footPoint,facing,standPoint,depth}`; validate polygons and foot anchor, reject overlaps with synthetic protected area. Use collision footprint (not centerline only), sensible minimum clearances and occupancy. If no valid path, **reject move and show diagnostic reason**, not teleport or cross protected space.
- Seat booking atomic/idempotent with waiting queue (bounded, stable tie-break); occupied seat cannot be assigned twice. Properly release on leave, session reset, actor cancellation; no zombie reservations.
- Clear distinction `actor travel position`, `occupied footprint`, `visual sprite bounding box`, and `footpoint depth sort`. All coordinates in 1080x1920 logical space independent of viewport scale.
- Where full pathfinding/navmesh is not feasible, use validated fixed **waypoint graph** for DEMO only; advanced A*/navmesh/camera-transformed masks belong to TASK-004. Do not claim real Concept03 right-side navigation approved.

### Rendering / sandbox safety
- Keep `canRenderDynamic()` in `packages/shared/src/geometry.ts` returning **false** in Task-003. Never add an `APPROVED` bypass or place diagnostic actors in the renderer's protected production visitor slot.
- Make a separate **`DEMO_DIAGNOSTIC_ACTORS`** renderer layer or sandbox component explicitly gated to offline DEMO only and labelled `SYNTHETIC ACTORS / NOT FOR LIVE`; it draws **generated shapes/rigged placeholder poses only** (simple full body silhouette, circles/limbs), not production sprites. Static sanctuary and protected art stay non-interactive.
- Mark each actor's **footpoint** and optional collider box under a debug toggle; public/offline default no external users; if any safety validation missing/invalid, **draw zero synthetic actors** and show fail-closed status. No untrusted input controls that bypass bounds/seat reservations.
- Provide visually distinguishable WALK vs SIT vs KNEEL with direction-facing, at least 4 synthetic pose stages across sit/kneel transition (mechanical interpolation/pose fixture), no teleport, stable 9:16 after resize, foreground occlusion ordering relative to pews. 2.5D actual sprite atlas and camera parallax are **future Tasks**; keep sprite adapter/pivot contract documented for Visual Batch C.
- One tiny local-only diagnostic toolbar or keyboard demo controls with clear labels: `Add visitor`, `Run walk/sit`, `Reflect/kneel`, `Leave`, `Reset`, `Pause`, `Speed 1x/2x` (or fewer with documented equivalent). It MUST NOT connect TikTok or simulate spiritual benefits from gifts. Screen has persistent Catholic virtual-space disclosure.
- A synthetic status counter may show active/seated/kneeling/queue length; never display unfiltered real names.

## 5. Test and performance gates

| ID | Executor | Acceptance |
|---|---|---|
| C01 | AI_CODE | Deterministic clock and identical replay state for same fixture+step sequence, boundary dt validated |
| C02 | AI_CODE | WALK→TURN→SIT and STAND→WALK→KNEEL→GET_UP→RETURN sequences, distinct transition poses and foot-anchor consistency |
| C03 | AI_CODE | 24 actors share distinct seats without collision; at 60 actor max capacity, excess bounded queue/rejection, no overbooking |
| C04 | AI_CODE | Duplicate ENTER, repeated requests, cancellation mid-gesture and pause/resume do not orphan seat/action |
| C05 | AI_CODE | Negative/malformed coordinates, invalid synthetic protected/nav data, waypoint crossing protected masks/collider footprint DENIED (fail closed) |
| C06 | AI_CODE | `canRenderDynamic` false on all production slots; inserting into real visitors/FX still not possible, no unapproved art loaded |
| C07 | AI_CODE + OWNER_WINDOWS | Existing **176/176** TASK-002 tests remain green, plus new tests; `typecheck`, `build`, `demo:smoke` PASS |
| C08 | OWNER_WINDOWS | Browser `/overlay/`: synthetic visitors visibly enter/walk/sit/kneel/return/leave, no visual teleport or pew penetration, 9:16 resize and pause correct |
| C09 | OWNER_WINDOWS | Two-minute synthetic 24-visitor DEMO on local Windows browser without console errors, memory/RAF/timer cleanup after RESET and Ctrl+C process isolation |
| C10 | SA_STATIC | No TikTok, gift, voice, real Christ/Mary art, candidate masks, access to OnlinePagoda or altered health/state contract |
| C11 | AI_CODE | Audit transitions and headless deterministic load replay for >1,000 generated actions with bounded queue, no divergence/leaks; **not** substitute for long soak TASK-007 |
| C12 | OWNER | UAT acceptance and explicit instruction before Developer creates PR; Owner merges only after SA review |

**Evidence labels:** `AI_CODE_PASS`, `OWNER_WINDOWS_PASS`, `SA_STATIC_PASS`, `NOT_RUN`, `FAIL` with runner, SHA, command/log or recorded observation. No invented benchmark/visual PASS. Any failed mandatory gate blocks merge until fixed on same branch. Automated test or 200 status is **not** proof of browser animation.

### Suggested Windows owner verification (after Developer ready)
Use the **correct OnlineChurch Developer feature branch**; stop its existing DEMO terminal first:
```powershell
Set-Location D:\Vibecode\onlChurch
git branch --show-current
git rev-parse --short HEAD
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run demo:smoke
npm.cmd run dev:demo
```
Open `http://127.0.0.1:3100/overlay/` and test a single WALK→SIT→KNEEL→RETURN, 24 synthetic actors, pause/resume, reset, resize, browser Console, Ctrl+C. Owner sends PASS counters or last 30 error lines; Developer fixes failures on the same branch. If dependencies change, include `npm.cmd ci` before the rest.

## 6. Handoff / PR and future path
- On approved task, AI Code fetches latest `main`, confirms SHA, creates `feature/TASK-003-visitor-actor-state-demo`; commits bounded source changes; supplies reproducible commands and short Owner UAT checklist. No PR until Owner explicitly says so; no direct merge, deploy or LIVE.
- PR body must include state transition chart, seat schema, bounded queue and cancellation policy, render boundary proof, test matrix C01–C12, demo screenshots/short clip **only if actually recorded**, exact runtime limitations and rollback.
- **Visual AI Batch C** works separately on sprite source and manifest, possibly Batch B Marian/votive. Actual PNGs are **not integrated in TASK-003**. Follow-up TASK-003B or TASK-002B integrates only approved assets, while TASK-004 develops camera parallax and complex transformed masks.
- Do not change OnlinePagoda running service, process, audio or port 3000. LIVE remains disabled until separate soak/capture/release gates.
