# 05 — SA / AI Code / Reviewer Working Agreement

> **OWNER DECISION — 2026-11-17:** D-01 **APPROVED**: this standalone `nguyenbui5701/OnlineChurch` repository with independent runtime, selectively adapting OnlinePagoda technology. D-04 **APPROVED**: Catholic (Công giáo) identity. The repository has been initialized; Design migration is in the SA draft PR. Remaining interactions, visuals, rollout and full Design sign-off are pending. See `08_DECISION_LOG.md`.

**Status:** role workflow documented; final G0 Design sign-off remains pending. Folder names are case-sensitive in repo.

## 1. Role boundaries
**Solution Architect (this chat)**
- Primary writable scope: `Design/**` inside **OnlineChurch**; do not update the former OnlinePagoda staging branch. May amend `.gitignore` solely to allow Design/Task and exclude ReviewPR.
- Reads source to analyze; writes requirements, UI, architectural decision records, interface design and acceptance gates.
- Commits every coherent design change on named SA branch. Never edits implementation/source in an AI Code branch.
- Once the G0 baseline is accepted, creates exactly scoped `Task/TASK-xxx-*.md` **in OnlineChurch** including read-first files, allowed paths, steps, acceptance, test evidence and rollback. Commits task and hands off to AI Code.
- When AI Code opens PR, reviews diff and test evidence; if local checkout is available, checks out **separate** `ReviewPR/PR-<number>/` worktree/snapshot and never touches AI Code workspace.
- Posts one formal GitHub PR review with summary, evidence, file/line issues and outcome: **APPROVE**, **COMMENT** or **REQUEST_CHANGES**. Never approves an untested change as verified.
- **Reject path:** retain isolated checkout and original Task; add fix checklist to that same Task and commit; AI Code responds with new commit; re-review.
- **Accept path:** after successful review and Owner-confirmed PR merge (not merely comment), remove disposable local `ReviewPR/PR-<number>/` and delete the completed Task file in a separate tracked commit, while retaining permanent design/decision/evidence in `Design/`. Do not delete user work, unmerged branch or untracked files blindly. Record task completion in decision log.
- Do not merge PR, delete branches, reset live workspace or change production without explicit Owner request.

**AI Code**
- Reads `Design/README.md`, all relevant `Design/*`, and the assigned `Task/TASK-xxx-*.md` before changes.
- Works only on task branch with explicit path allowlist; cannot silently change Design requirements, Task acceptance or this SA rule.
- Implements, documents risks and evidence; runs relevant tests; creates PR against approved target branch; posts changed files, verification commands, PASS/FAIL, screenshots if UI, known issues.
- No production LIVE connection during automated tests. Uses DEMO fixtures and isolated ports/data. No credentials in code, logs or PR.

**Visual/Audio AI (separate chat)**
- Receives `Design/06_VISUAL_AUDIO_BRIEF.md`, `Design/09_CATHOLIC_CONTENT_AND_SAFEGUARDS.md` and `Design/12_VISUAL_AGENT_STARTER.md`, delivers original concept art/transparent layers/manifest and prompt provenance. Cannot edit code or use customer LIVE credentials; SA approves art prior to integration.

**Owner**
- Makes product/religious/visual/repository decisions and authorizes deployment/merge. Final go-live decision is human.

## 2. Branch, commit and review rules
- SA: `sa/<topic>`; AI Code: `feature/TASK-xxx-...`; reviewer: local disposable `ReviewPR/PR-n/` only.
- Commits should be small and descriptive; do not rewrite shared history, force-push, run destructive cleanup or delete a PR without permission.
- Prefer one atomic doc commit per coherent change. Before modifying an existing file, check its current state/sha; no overwrites of teammate changes.
- PR has linked Task and acceptance checklist, check logs, demo video/screenshots where relevant, and migration/rollback path.
- Reviewer **REQUEST_CHANGES** on P0/P1 defects: privacy, wrong religious content, duplicate billing/gift attribution, voice wrong-user, unstable LIVE, source/cross-app contamination, failed build/tests.
- COMMENT + explicit blocker for missing evidence; do not treat no-comment as test PASS.

## 3. `ReviewPR` lifecycle and limitations
- `ReviewPR/` is **local ignored scratch space**, never committed. Reviewer can use `git worktree add ReviewPR/PR-n <head>` on a machine where Git checkout is available. Use diff-only GitHub review if no local checkout, and state that limitation rather than claiming checkout.
- Delete only the precise reviewer-created worktree **after merge, recheck, and Owner approval of cleanup**. Prefer `git worktree remove` for worktrees; verify clean state first.
- If serious comments remain: keep the isolated review copy and update Task's fix checklist.

## 4. Scope and safety
- Never modify/restart `OnlinePagoda` production processes, its port 3000, settings, data or asset cache while live.
- All church art, text, audio, display names and moderation follow `Design/01_REQUIREMENTS.md`; no pay-to-pray mechanics.
- A claim of PASS requires actual commands and outputs; source inspection ≠ tests.

## 5. Cross-repo hard boundary
- OnlinePagoda's `main`, production data/port 3000 and launch scripts are read-only for this project. Draft PR #1 is staging only, and must not be merged into pagoda `main` for Church implementation.
- The implementation project of record is now `nguyenbui5701/OnlineChurch`; all future Task and AI-Code PRs belong there. Every ported source file has origin SHA, license/provenance and regression evidence.
- Catholic iconography, prayer text and effects require content review as well as code tests. Provide Visual AI both 06 and 09 guides.

## 6. G0 handoff authorization and ordering (2026-11-17)
The Owner's `tiếp tục` immediately after the proposed MVP concept is recorded as permission to proceed with the recommended **implementation baseline and TASK-001 preparation**. It is not a request for the SA to merge a PR, assign a live credential, operate in production or approve specific generated artwork. The Developer begins TASK-001 only when the Design/Task branch is merged by the Owner (or the Owner explicitly authorizes that specific branch as their base). No code should be implemented on a draft Design PR.


## 7. Owner-executed checks (decision 2026-11-17)
To save AI Code tool time, the Owner **may run designated Windows verification commands** and paste only terminal PASS summaries or failing command + concise log tail. AI Code remains responsible for implementing code, targeted tests while fixing it, writing reproducible commands, and addressing any Owner-reported failure. **A test is PASS only if executed by a clearly identified person/environment with exit code or adequate log; otherwise NOT RUN.**
SA independently reviews the diff and test evidence. Source review != an executed Windows test. Do not skip security isolation checks, required smoke tests or content/sacred-area gates to optimize tokens. Assign long regression/soak/visual- Studio/UAT checks to Owner when the Task allows it. Detailed matrix: `14_OWNER_EXECUTED_TEST_POLICY.md`.
When the connected GitHub account is the PR author, GitHub forbids self-APPROVE: SA submits a COMMENT with `SA_ACCEPTED_ON_DIFF` or requests changes if needed; never claim this is an official GitHub APPROVE. The Owner alone decides merge.
