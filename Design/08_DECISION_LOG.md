# 08 — Owner Decision Log — G0 Implementation Baseline

**Status:** **G0 BASELINE ACCEPTED FOR TASK-001** (2026-11-17); product art files, full LIVE deployment and later tasks retain their own approval gates.
**Evidence:** Owner explicitly approved Catholic identity and standalone repository. Immediately following SA's proposed 2.5D + Marian side + free-action MVP bundle, Owner replied **"tiếp tục"**. SA treats that as go-ahead to proceed using the *proposed defaults*, while preserving later Owner sign-off for exact content/art and production. This is not a claim of detailed visual-art approval.

| ID | Decision / operating rule | Status |
|---|---|---|
| D-01 | Independent repo `nguyenbui5701/OnlineChurch`, separate runtime; vetted reuse of OnlinePagoda techniques only | **APPROVED explicitly 2026-11-17; repo initialized** |
| D-02 | Vietnamese Windows UI, TikTok LIVE Studio 1080×1920 9:16 presentation | **G0 baseline accepted** |
| D-03 | DEMO-first; free enter, quiet prayer and symbolic votive candle; optional neutral gifts | **G0 baseline accepted** |
| D-04 | **Công giáo / Catholic**, fictional church interior, principal front crucifix | **APPROVED explicitly 2026-11-17** |
| D-05 | Warm **2.5D layered painterly** image, side Marian devotional corner, candles to the side; protected sanctuary | **G0 concept baseline accepted; specific visual assets still need Owner review** |
| D-06 | No pay-to-pray, simulated sacraments/priests, guaranteed grace or raw prayer speech | **HARD SAFEGUARD — mandatory** |
| D-07 | Attendee enters in aisle, uses pew and side devotional point; gentle bounded gestures | **G0 baseline accepted** |
| D-08 | Optional filtered Vietnamese name-specific thank-you, quiet mode, one audio owner | **G0 baseline accepted; exact texts/TTS to be reviewed in later task** |
| D-09 | Windows isolated workspace, separate port/data/cache/title, candidate 3100; **only one active production TikTok LIVE connection at a time on this PC for MVP** | **SA conservative operating baseline; actual hardware/port check pending** |
| D-10 | One Task per AI-Code PR; SA design owner, AI Code edits only allowed files; ReviewPR separate; Owner controls merge and go-live | **WORKFLOW ACTIVE** |

## Design and repository state
- Repo created: `https://github.com/nguyenbui5701/OnlineChurch`.
- Design PR #1 was merged; **TASK-001 implementation PR #2 merged 2026-11-17** (`0b5df414acb45d0abe4b8ae3ae292b064a175187`). **Design PR #3 merged 2026-11-17** (`ce996084d3d47de28ba8f16de05d615dfac70899`).
- The former `https://github.com/nguyenbui5701/OnlinePagoda/pull/1` was closed, **not merged**, after migration. Pagoda `main` remained unchanged.
- Source technical reference is pinned at `OnlinePagoda@ee55ee81e507135b805d116586f5814eed9a89a9`.
- **Current status:** TASK-001 completed and removed from active Task/ after verified Owner merge. SA reviewed PR #2 with `COMMENT` (GitHub denied self-approval), no P0/P1 source blocker. Developer reports 107 tests PASS; independent Windows execution by SA was NOT RUN. Closeout: `15_TASK001_CLOSEOUT.md`. Next task will prepare offline visual renderer while Batch A assets remain under production HOLD.

## G0 acceptance checklist
- [x] Catholic identity and standalone source repository approved.
- [x] MVP baseline adopted from Owner continuation: warm 2.5D, side Marian concept, protected sanctuary, free interactive prayer/candle, gifts only neutral, optional TTS.
- [x] DEMO-first and offline isolated scaffold agreed as the first safe implementation Task.
- [x] Operational default avoids simultaneous production LIVE; port 3100 remains configurable/unverified.
- [ ] **Final** Marian depiction, Catholic phrase catalog, art provenance and copyright cleared for scene implementation (before TASK-002).
- [ ] Tested Windows audio route, production concurrent behavior, actual capture and go-live (before TASK-006/007).
- [x] Owner merged Design/Task PR #1 (2026-11-17), merge SHA `f241a76774b5f786709d0915df01a5614af6603f`.

## PR / Task lifecycle
1. SA commits Design decisions and TASK-001 to this SA branch.
2. Owner reviews and merges PR #1 (or gives explicit permission to base Developer branch on it).
3. AI Code performs only TASK-001 and opens separate PR.
4. SA reviews source/diff/test evidence and posts formal review without editing Developer workspace.
5. Owner merges accepted code PR; SA archives outcome in Design and removes completed task only with confirmed merge and approved cleanup.

For later major changes, create dated decision amendments; do not retroactively pretend initial generated art or runtime operations were approved.

## New decisions — 2026-11-17
- **D-11 / VISUAL:** Owner selected Concept 03 **Romanesque Golden-Ivory Nave** as art direction. SA accepts its architectural composition. Specific Jesus/Mary depictions, moved side candle interaction, alpha cutouts, protected polygons, rights and Studio overlay capture remain **ON HOLD for production**. See `13_CONCEPT03_SA_VISUAL_REVIEW.md`.
- **D-12 / TEST DELEGATION:** Owner can execute full Windows checks and UAT to reduce Developer chat/tool cost; AI Code handles fixes and targeted tests; SA reviews code and submitted evidence. No invented PASS; see `14_OWNER_EXECUTED_TEST_POLICY.md`.

## D-13 — Concurrent visual and development workflow
- Owner reported Visual AI is actively producing **Concept 03 Batch A**; actual Batch A assets **not submitted/reviewed** as of this decision.
- SA may prepare a distinct offline **TASK-002 renderer foundation using generated geometric placeholders only**. No user-provided preview or unapproved Christ/Mary asset integration. After accepted Batch A and a later explicit Task/approval, separately integrate production assets and final masks. This is a safe subdivision of roadmap TASK-002, not an approval to publish.

## D-14 — Visual review artifact delivery (Owner, 2026-11-17)
Owner authorizes separate Visual AI to push images and manifest to a **GitHub review folder and branch**, so SA can review by PR link instead of requiring repeated chat uploads. Scope: `VisualReview/<Concept>/<Batch>/**` on `visual/<concept>-<batch>-review` branches only. Draft PRs are review containers **not to be merged into main**, until an explicit later Owner/SA asset-integration Task authorizes selected originals. Current destination `VisualReview/Concept03/Batch-A/`. Repeats for future batches. See `16_VISUAL_REVIEW_REPO_WORKFLOW.md`; tool-access failures must be reported and Owner may perform local push.
