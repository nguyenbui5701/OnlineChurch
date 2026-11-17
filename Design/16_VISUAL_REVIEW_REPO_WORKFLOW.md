# 16 — Permanent VisualReview GitHub Upload and Review Protocol

**Decision:** D-14, Owner 2026-11-17. **Status:** Review-workflow authorized; not approval of images, licenses, sacred masks or production deployment.
**Repository:** https://github.com/nguyenbui5701/OnlineChurch
**Scope:** All present and future Visual Agent batches under `VisualReview/`, in a branch of their own. The visual reviewer does not need assets pasted into chat provided the relevant image URLs are accessible.

## 1. Routing and branch/PR contract

| Batch | Review branch (from up-to-date `main`) | Folder, EXACT case |
|---|---|---|
| Current selected Concept 03 Batch A | `visual/concept03-batch-a-review` | `VisualReview/Concept03/Batch-A/` |
| Concept 03 Batch B | `visual/concept03-batch-b-review` | `VisualReview/Concept03/Batch-B/` |
| Concept 03 Batch C | `visual/concept03-batch-c-review` | `VisualReview/Concept03/Batch-C/` |
| Concept 03 Batch D | `visual/concept03-batch-d-review` | `VisualReview/Concept03/Batch-D/` |
| Other new concepts/batches | `visual/<concept>-<batch>-review` | `VisualReview/<Concept>/<Batch>/` |

- Each branch is based on the latest OnlineChurch `main`; commit only the one assigned Batch folder. No edits to `Design/`, `Task/`, `apps/`, `packages/`, `scripts/`, `assets/`, root README, `.gitignore` or other batches.
- Open a **DRAFT GitHub pull request against OnlineChurch/main for review visibility**. This Draft PR is *not* a request to merge the image folder. SA/Owner comments and decides art acceptance; do **not** merge it into main by default.
- Send SA **only** Draft PR URL, head commit SHA, manifest link and a short summary of changes. SA should use exact branch/commit ref, not rely on changing latest image filenames.
- After review: `ART_REVIEW_PASS` means a specific SHA/files cleared for later integration, not approval of everything on the branch. `REQUEST_REVISIONS` means fix same Visual branch, update manifest/revision and have SA review changed SHA. `ON_HOLD` means copyright, religious depiction, alpha, geometry or other gate remains open.
- Approved production images are copied into code/production `assets/` **only** by Developer under a separate authorized Task (TASK-002B or later), after owner approval and provenance/sha verification. Never let the renderer load `VisualReview/` directly at runtime.
- Archive PR link/commit approval in `Design/` from the SA branch. Do not delete Visual branches or assets automatically; archive/cleanup happens only with Owner permission. Existing branch and commit history will survive as review evidence even if PR eventually closes.

## 2. Required folder contents

```text
VisualReview/
  README.md                          # repository review policy; no production assets
  MANIFEST_TEMPLATE.csv              # template, not approval
  Concept03/
    Batch-A/
      README.md                      # batch instructions; committed on main
      composite_preview.png          # 1080×1920 production candidate preview, no annotation baked in
      technical_overlay.png          # annotated ENGINEERING-ONLY preview
      layers/
        bg_far_nave.png
        ...                           # separate true transparent RGBA planes
      masks/                          # optional CANDIDATE masks, NOT APPROVED
        candidate_protected.json
      manifest.csv                    # actual file inventory with hashes and status
      handoff.md                      # decisions required, limitations, changed items
```

Future batch folders follow the same template. The `composite_preview.png` image may be opaque; **each claimed RGBA foreground layer must have meaningful alpha**, verified via minimum/maximum and percentage alpha=0/255/intermediate. Do not claim the original upscaled concept preview is a production cutout.
All coordinate geometry and pivots use logical **1080×1920** unless explicitly documented otherwise; include exact register x/y, layer order, scaling, crop/original image size, anchor/pivot and intended use.

`manifest.csv` must include at minimum:
`relative_path,width_px,height_px,format,alpha_min,alpha_max,pivot_x,pivot_y,layer_order,sha256,source_type,source_detail,rights_status,review_status,notes`.
One row **per actual delivered asset**, not merely proposed names. `sha256` is of file bytes, not of text description. Use `review_status=SUBMITTED` for review and do not set `APPROVED` yourself. For masks, state `CANDIDATE_NOT_APPROVED`.

## 3. Publishing rules and limits

- Repository is currently PUBLIC. Never push credentials, personal images, purchased/unlicensed photography or content that must remain private. Check license and usage rights for all outside material. Generated art still needs concept/iconography review.
- Keep a normal image preferably **<= 5 MiB**, and batch review images reasonably sized (recommended <= 50 MiB total) to avoid Git history bloat. These are workflow recommendations, not GitHub hard limits. Avoid huge PSD/RAW and large video files in Git. For large originals, use a separately authorized shared Drive/storage folder plus SHA256 and a small preview/manifest in GitHub; ask Owner before selecting a storage destination.
- Use **PNG** for actual transparent/layered art, JPEG/WEBP for previews when appropriate; GitHub displays web-friendly preview images. Never treat a Git LFS pointer as an inspectable PNG; LFS requires separate access validation.
- A push must be verified by re-reading GitHub branch HEAD, file list and at least one preview, then report URL. Failure of Git/GitHub access is **NOT UPLOADED**, not success.
- GitHub may show images via their web page; for SA technical checks, the direct raw image URL (or downloadable file from an authorized connected source) must be accessible. If SA cannot retrieve binary image bytes from the PR or public raw URL, do not invent a visual review; ask for accessible Drive location or file transfer as fallback.

## 4. Command recipe for Visual AI with local Git access

Only if Visual AI has GitHub permissions and a *separate OnlineChurch clone or clean working tree*, **not the developer's active source checkout**:

```powershell
git fetch origin main
git switch -c visual/concept03-batch-a-review origin/main
# Save generated assets and completed manifest under:
# VisualReview/Concept03/Batch-A/
git status --short
git add -- VisualReview/Concept03/Batch-A/
git diff --cached --check
git diff --cached --name-only
git commit -m "visual(concept03): submit Batch A assets for review"
git push -u origin visual/concept03-batch-a-review
```

Then open a **Draft PR** against `main`, with title `[VISUAL][REVIEW ONLY][DO NOT MERGE] Concept 03 Batch A`. Include changed files/manifest/head SHA, 1–2 preview links, known gaps and explicit instruction *not to merge*. If `git switch -c` reports an existing branch, inspect status and re-use the intended branch; **do not reset, force-push, delete a branch or modify an existing worktree** without checking with Owner.

If Visual AI only generates image files in ChatGPT and has no real local clone/GitHub binary writing capability, it should assemble a small downloadable folder/ZIP and send Owner exact local push commands for the *same review branch and folder*. This is a fallback, not proof of a completed push.

## 5. SA review gate (specific to Concept03 Batch A)

SA must examine actual images from the branch and verify each registered layer, edges/alpha, canvas sizes, alignment, correct sanctuary/visitor separation, right-side votive placement, safe margins, Catholic iconography, source/license status and any candidate masks. The engineering overlay alone cannot prove safety. Final masks and Batch B/C/D cannot be treated as approved from a Batch A submission.

The report must be attached to the Visual Draft PR with **per-file** `ACCEPTED_DIRECTION`, `REVISION_REQUIRED` or `APPROVAL_HOLD`, and state which Batch/revisions are fit for future Task integration. On shared-owner PRs, GitHub may reject formal self-APPROVE; SA COMMENT remains valid evidence and Owner controls accept/merge.
