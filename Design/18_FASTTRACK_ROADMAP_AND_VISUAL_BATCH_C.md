# 18 — Fast-track Roadmap: Dynamic Church Scene Before LIVE

**Owner instruction (2026-11-17):** accelerate to walking sprites, detailed sitting/kneeling, parallax camera, complex masks, premium gift FX, full operator dashboard and endurance/load tests. **No production LIVE until every related gate is accepted.** This supersedes the old coarse Task numbering in Design/11 without declaring earlier functionality complete.

## Parallel critical path (one AI Code task/PR at a time; Visual AI produces separate reviewed batches)

| Gate/track | Responsible | Deliverable | Dependency |
|---|---|---|---|
| **TASK-003A (now)** | AI Code | deterministic actors, seats, WALK/SIT/KNEEL/RETURN/LEAVE synthetic-only DEMO | TASK-002 merge verified; no real art |
| **Visual Batch C (now)** | Visual AI | registered fictional visitor walk/stand/sit/kneel/get-up/turn sprite atlases + pivot/animation manifest | Concept03 visual style, not Batch A production approval |
| **Visual Batch B (parallel)** | Visual AI | Marian side and accessible votive stand candidate, unlit/lit candles and exact geometry | Owner approves specific Catholic depiction before integration |
| **TASK-004** | AI Code | parallax camera, layered depth, transformed mask admission, multi-region nav/collision graph and seat zones | TASK-003 simulator; final asset masks require Owner review |
| **TASK-002B / 003B integration** | AI Code | accepted Batch A/B/C art atlas and *approved* sacred/actor/gift masks; free reflection/candle commands | Visual Owner/SA copyright/religious/geometry sign-off |
| **TASK-005** | AI Code | premium non-liturgical gift effects, rate limiting, queue/coalescing, safety/quiet overlays; offline fixtures first | approved safe regions / FX assets |
| **TASK-006** | AI Code | full operator dashboard, DEMO controls, statuses, queue/fault telemetry, audio mute and QA tools | event/state contracts and renderer |
| **TASK-007** | AI Code + Owner | long-running soak, stress, performance, FPS/memory/queue/voice/capture audit | all main interactive features |
| **TASK-008** | AI Code | tested TikTok adapter/room binding/reconnect, bounded dedupe and local synthetic replay; offline defaults | QA baseline stable; no production account connection |
| **TASK-009** | SA + Owner | Windows 9:16 Studio rehearsal, moderation, audio-route isolation, rollback, manual go/no-go | all earlier gates PASS |

Parallelism is **AI Code + Visual AI only**, no two code Tasks editing shared scene at the same time. SA may prepare next Task Design while a Developer task is in progress, but must not merge overlapping implementation branches without rebase/re-review. Visual review Draft PRs are **never merged into main by default**; Developer integrates approved assets through own code PR.

## Visual Batch C — next instructions to Visual AI

Create **new review branch** `visual/concept03-batch-c-review` from current `main`, and write only `VisualReview/Concept03/Batch-C/**`. Draft PR title `[VISUAL][REVIEW ONLY][DO NOT MERGE] Concept 03 Batch C — Visitor Sprites`. No app code/Task/Design edits.

Required output for one consistent fictional, modestly dressed, non-clergy visitor set:
- Full-body stylized natural character matched Concept03 light/perspective, **genuine transparent** PNG frames for `idle`, `walk` (minimum 6 per cycle), `turn` (front/3-quarter/side/back as feasible), `sit_down`, `seated`, `stand_up`, `kneel_down`, `kneel_hold`, `get_up`, `leave`. Every animation has foot/hip/sit/knee contact anchors. Include mirrored direction policy; don't mirror asymmetrical symbols/printed text.
- Explicit 1080x1920 scene registration mapping and **per-frame** atlas rectangle, source size, animation fps/duration, pivot (footpoint), depth/y order, target seat/reflection contact points; no half-hidden feet, broken knees, foot sliding, frame-to-frame proportion changes or shoes floating above floor. Provide realistic transition contact sheets and small test clip/GIF **only if actually produced**.
- Human gestures modest and natural: walking, sitting in pew, kneeling in non-sacred side/pew place, standing up, returning. No priest vestments, gifts-as-prayer, simulated Eucharist or blessings.
- Deliver `composite_preview_review.webp` or a lightweight contact sheet, `animation_manifest.csv`, `layers/*.png` or a documented sprite atlas, `QA_POSE_CONTACT.md`, `handoff.md`, SHA256/rights in manifest; every uploaded file under one review folder. Clearly mark artist work as submitted not approved.
- Coordinate with Task-003 **conceptual state contracts**; do not require AI Code to integrate unapproved sprites. If timing/pivot values are provisional, label them `DRAFT` and ask SA before asserting runtime correctness.

**Batch A R1 at PR #6:** accepted as **reference/review baseline** after SA R2, but NOT approved as production art. Right-floor hard seam/perspective, true actor footprint/camera tests, exact Christ/Marian portrayal and licenses remain on HOLD. Work on Batch C may proceed in parallel. Batch B can follow/parallel based on capacity.

## Release gate (strict)
- Synthetic simulation verified locally by Owner, real sprite/alpha/mask/route approved before public integration, no avatar/gift in sanctuary.
- Free entry/reflection/candle completely independent of gift amount or priority, no clergy/sacraments/paid spiritual outcomes.
- Full dashboard controls pause/quiet/kill individual queue without killing OnlinePagoda; TTS ownership/copyright and moderator policy checked.
- Target performance thresholds (FPS, concurrent actors, queue drain and soak duration) must be set and recorded by SA/Owner using measured baseline before certification; **do not invent PASS/FPS/soak claims**. Begin with measured 24/60-actor scenarios, then scale.
- Stress cases cover 100+ bursts, duplicate/out-of-order, reconnect, GPU context loss, capture source drop/recovery, TTS queue growth, manual emergency stop and 9:16 mobile readability.
- Production TikTok LIVE connection only after standalone rehearsal and explicit Owner approval; do not touch OnlinePagoda active live/runtime.
