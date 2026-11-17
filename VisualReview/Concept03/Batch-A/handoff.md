# Visual Batch A — Revision R1 / SA Review PR #6

**Branch:** `visual/concept03-batch-a-review`
**PR:** https://github.com/nguyenbui5701/OnlineChurch/pull/6
**Baseline reviewed SHA:** `0765c527893b29c2152d8aeea3355378c90e4e71`
**Remote status:** original Batch A files verified in PR #6. **This R1 revision was prepared and tested locally; its push must be verified separately.**
**Review verdict:** `SUBMITTED / REVISION_REQUIRED`, `PRODUCTION_HOLD`; **DO NOT MERGE**.

## Work performed (only Batch A)
- Rebuilt the right passage **inside existing `05_floor_and_side_lane.png`**, removing the prior elevated ledge and extending a floor-level tiled plane from the same source artwork. Kept the Romanesque golden-ivory composition and existing 9-plane structure. The revised candidate route goes from the central aisle around the **front of the right pews** to the right-side landing. No future votive stand or Marian asset has been added.
- Cleaned color-fringed transparent edges of all non-base planes by mapping alpha below 35 to zero, alpha >= 225 to 255, and using nearest interior RGB to decontaminate the semi-transparent border. This addresses ghosted wood objects from previous 253-alpha interiors.
- Exported updated `composite_preview.png`, `technical_overlay.png` plus 1080×1920 `*_review.webp` at <1,000,000 bytes each, intended for GitHub connector/preview review. Technical overlay is engineering-only.
- Added dark/light matte QA crops at original 100% and enlarged 200% for each stained-glass window, sanctuary and both pew layers. `qa_composite.py` reports exact 9-plane compositing, SHA256, dimensions, alpha and candidate static image-space path overlap.

## Reproducible QA
From the Batch-A folder with Python, Pillow, NumPy, OpenCV installed:
```bash
python qa_composite.py
```
- Each of 9 `layers/*.png` is native output **1080×1920 PNG RGBA**, registered at `(0,0)` with top-left pivot. Layer order: lexical/numeric `00` through `08` using straight-alpha `PIL.Image.alpha_composite`. Background `00` is intentionally opaque. The other 8 layers have meaningful alpha.
- `composite_preview.png` is the exact RGB save of the 9-plane composition. Pixel equality is checked after reopening the PNG.
- Manifest SHA256 are file-byte hashes, verified against each listed asset.
- Candidate centerline shown in overlay is checked with a **25-pixel line stroke** against the alpha>25 cutouts of sanctuary and both pews. This is **only a static 2D artwork check**; it does not certify a navigable avatar footprint or safe camera/parallax geometry.

### Measured evidence
- `00_background_backdrop.png`: alpha 255..255; opaque 100.0% → **100.0%**; partial 0.0% → 0.0%
- `01_bg_architecture.png`: alpha 0..255; opaque 0.064% → **56.2987%**; partial 58.229% → 0.3325%
- `02_stained_glass_left.png`: alpha 0..255; opaque 0.021% → **1.412%**; partial 1.827% → 0.1668%
- `03_stained_glass_right.png`: alpha 0..255; opaque 0.017% → **1.5957%**; partial 2.042% → 0.1124%
- `04_stained_glass_central.png`: alpha 0..255; opaque 1.178% → **1.2651%**; partial 0.27% → 0.1186%
- `05_floor_and_side_lane.png`: alpha 0..255; opaque 0.02% → **41.1094%**; partial 39.493% → 0.274%
- `06_sanctuary_protected.png`: alpha 0..255; opaque 0.063% → **11.0365%**; partial 11.224% → 0.0915%
- `07_pews_left_occluder.png`: alpha 0..255; opaque 0.035% → **10.2528%**; partial 11.219% → 0.5621%
- `08_pews_right_occluder.png`: alpha 0..255; opaque 0.01% → **4.5706%**; partial 5.025% → 0.1915%
- `composite_preview_review.webp`: 202780 bytes / 1080×1920 (under 1 MiB).
- `technical_overlay_review.webp`: 198760 bytes / 1080×1920 (under 1 MiB).

## Remaining review/approval gates
1. **OWNER_CONTENT_APPROVAL_HOLD:** Crucifix with figure of Christ and sanctuary/altar portrayal not religiously approved. Empty Marian niche intentionally kept for future Batch B; no Marian art included here.
2. **CANDIDATE_NOT_APPROVED:** `masks/candidate_zones_NOT_APPROVED.json` and drawn route are visual proposals only; never import into application. Actor radius, footfall paths, collisions after parallax/camera transforms and any TikTok LIVE Studio overlay require later actual verification.
3. **ART REVIEW NEEDED:** The right-floor extension is a digitally reprojected texture from the same existing image, not a new 3D survey. At high zoom some patterned floor transitions, stained-glass edge coloration and perspective cues may require further artist revisions. Dark/light matte crops are evidence, not automatic artistic acceptance.
4. **LICENSE/RIGHTS HOLD:** Scene source is AI-generated and digitally edited. No stock church photographs or real parish trademark knowingly added. AI media rights/source and Catholic iconography require explicit Owner/SA clearance before runtime use.
5. **TASK-002B remains blocked** pending separate Owner/SA authorization; TASK-002 synthetic renderer is independent. No application source, Design, Task, other batch or `main` edited.

## Submission instructions
- Update **the existing Draft PR #6** through its existing `visual/concept03-batch-a-review` branch, without force push and **without merging**.
- After push, obtain remote new HEAD SHA and ask SA to review `composite_preview_review.webp`, `technical_overlay_review.webp`, `qa/` crops, manifest and `qa_composite.py`.
- This handoff describes the prior PR #6 as uploaded/verified, **not this R1 commit until the new push is confirmed**.
