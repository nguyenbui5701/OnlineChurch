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
- Design branch: `sa/catholic-design-v1`; draft PR: `https://github.com/nguyenbui5701/OnlineChurch/pull/1`.
- The former `https://github.com/nguyenbui5701/OnlinePagoda/pull/1` was closed, **not merged**, after migration. Pagoda `main` remained unchanged.
- Source technical reference is pinned at `OnlinePagoda@ee55ee81e507135b805d116586f5814eed9a89a9`.
- **First implementation scope:** `Task/TASK-001-ISOLATED-SCAFFOLD-DEMO.md` may be authored and reviewed now; AI Code starts after Owner merges design/task PR or explicitly approves working off that SA branch.

## G0 acceptance checklist
- [x] Catholic identity and standalone source repository approved.
- [x] MVP baseline adopted from Owner continuation: warm 2.5D, side Marian concept, protected sanctuary, free interactive prayer/candle, gifts only neutral, optional TTS.
- [x] DEMO-first and offline isolated scaffold agreed as the first safe implementation Task.
- [x] Operational default avoids simultaneous production LIVE; port 3100 remains configurable/unverified.
- [ ] **Final** Marian depiction, Catholic phrase catalog, art provenance and copyright cleared for scene implementation (before TASK-002).
- [ ] Tested Windows audio route, production concurrent behavior, actual capture and go-live (before TASK-006/007).
- [ ] Owner merges Design/Task PR after review; this step must not be simulated by SA.

## PR / Task lifecycle
1. SA commits Design decisions and TASK-001 to this SA branch.
2. Owner reviews and merges PR #1 (or gives explicit permission to base Developer branch on it).
3. AI Code performs only TASK-001 and opens separate PR.
4. SA reviews source/diff/test evidence and posts formal review without editing Developer workspace.
5. Owner merges accepted code PR; SA archives outcome in Design and removes completed task only with confirmed merge and approved cleanup.

For later major changes, create dated decision amendments; do not retroactively pretend initial generated art or runtime operations were approved.
