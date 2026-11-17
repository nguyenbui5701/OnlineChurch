# 14 — Owner-Executed Tests and Token-Efficient QA Responsibilities

**Decision D-12 (Owner, 2026-11-17):** If the Owner can run a verification command on their Windows PC, AI Code may delegate it with exact instructions instead of repeatedly executing the full suite, **without reducing acceptance standards or concealing test status**.

## Responsibilities by phase
| Activity | Preferred runner | Minimum evidence |
|---|---|---|
| Implement and quick targeted regressions after each code change | **AI Code** | command and PASS/FAIL on task branch |
| Static review of source, Design, allowlist, safety boundaries | **SA** | exact commit/diff, findings/review outcome |
| Clean install, full typecheck/tests/build/smoke on Windows | **Owner Windows**, or AI Code if Owner can't | repo path, commit SHA, command, exit status/PASS tail |
| Local 9:16 browser/UAT, Ctrl+C and port isolation | **Owner Windows** | checklist/results, error/screenshot if needed |
| Headless automated E2E, lifecycle fault tests, security cases | AI Code / CI / Owner per Task | actual run output; no invented PASS |
| Long soak, GPU/video, phone TikTok Studio, audio device routing | **Owner** | OS/PC configuration, FPS/audio/video observations |
| PR acceptance and code audit | **SA** | review COMMENT/APPROVE/REQUEST_CHANGES + evidence classification |
| Merge, release and LIVE | **Owner ONLY** | explicit go/no-go |

## How AI Code hands off
1. AI Code runs the **small targeted unit tests** needed to debug code before handing it off; never blindly asks Owner to debug a known failure. If a Task defines pre-push tests, follow that Task or seek SA amendment.
2. AI Code reports SHA + environment and an ordered 1-shot PowerShell block, with expected success marker for each command. Owner runs it in the **OnlineChurch checkout only**, not OnlinePagoda.
3. Owner returns **only** FAIL command plus last 20–40 lines of output, or final test totals/PASS summary and UAT observations. Never ask for full `node_modules` logs.
4. AI Code fixes failures on the **same Developer branch/PR**, runs targeted regressions; Owner reruns impacted full gates. SA rechecks final SHA and evidence.
5. If a test was not performed, record `NOT RUN (executor + reason)`; if Owner performed it, label `OWNER_PASS` with provided evidence. SA source audit is `SA_STATIC_REVIEW`, not runtime PASS.
6. No test may involve arbitrary process termination, credentials, public LIVE gifts, or modifying OnlinePagoda. No conditional deployment/merge until mandatory gates are covered.

## TASK-001 current handoff on PR #2
PR: `https://github.com/nguyenbui5701/OnlineChurch/pull/2` head `9ed3896aebd3ccbfd24b635349ad3260c6c5c8c1` (unmerged at the review time). Developer already reports **107/107 Vitest PASS** and clean smoke PASS; owner browser display acknowledged. **SA inspected the patch but did not independently execute on the Owner's PC.**

The Owner can run these **from the existing OnlineChurch clone**:

```powershell
Set-Location D:\Vibecode\onlChurch
git status --short
git rev-parse --short HEAD
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run demo:smoke
```

**Branch caveat:** GitHub PR #2 is not yet merged into `main`. Use the Developer's local `feature/TASK-001-isolated-scaffold-demo` checkout or a separate isolated review worktree for this run, **not an old `main` without implementation**. For a clean-install reproducibility check, also run `npm.cmd ci`; since it touches only OnlineChurch node_modules, avoid it while a local demo is being used. Finish with `npm.cmd run dev:demo`, open `http://127.0.0.1:3100/`, check health and state and stop with Ctrl+C in its own terminal.

Report: `HEAD SHA`, `typecheck PASS`, `tests N/N PASS`, `build PASS`, `smoke PASS`, `browser PASS/FAIL`, plus concise failures. If any FAIL, do **not** merge and ask AI Code to fix PR #2. Owner merges only after satisfactory review/evidence. These commands do not connect real LIVE or inspect/delete OnlinePagoda.

## Future Tasks
SA writes specific `AI_CODE` vs `OWNER_WINDOWS` test ownership directly in each Task and takes into account actual hardware, environment, and risk. **Security, sacred masks, payment neutrality, TTS attribution and live-release gates cannot be waived for token savings.**
