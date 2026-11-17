# OnlineChurch — Concept 03 / Visual Batch A SA Handoff

**Date:** 2026-11-17  
**Branch intended:** `visual/concept03-batch-a-review` · **Target:** `main` (Draft PR, DO NOT MERGE)  
**Review status:** `SUBMITTED` candidate visuals, **NOT APPROVED**; files prepared locally, upload/push unverified until Owner pushes.

## Delivered in this folder
- `composite_preview.png` — 1080×1920 RGB preview, built **directly from the 9 registered RGBA planes**, not the old Concept03 flat preview. The stack can recreate it pixel-exactly.
- `technical_overlay.png` — review-only zones/labels, NOT mask data for the application.
- `layers/` — 9 RGBA planes (one intentionally fully opaque base, 8 meaningful-alpha cutouts). All are 1080×1920 with (0,0) origin and canvas-sized registration.
- `masks/candidate_zones_NOT_APPROVED.json` — only provisional concept zone vertices; NOT ACCEPTED for runtime.
- `manifest.csv` — all actual delivered PNGs and JSON with SHA256 of exact bytes, file size, alpha extrema and ratios, provenance, pivot and review status.

## Visual design decisions
- Romanesque Golden-Ivory architecture maintained: rounded stone vaults, warm sunlight, colored glass, center crucifix with Christ, foreground pews and aisle.
- The left Marian nook is intentionally **empty** in Batch A; Marian depiction belongs to Batch B and requires separate content review.
- No candle stand, flame, character or gift FX is included. The **right-side floor/pew composition** leaves a candidate landing near x=663..1014, y=1080..1272, connected from the central aisle **in the technical sketch only**.
- The front sanctuary is a single still plane (`06_sanctuary_protected.png`) with crucifix and altar; Christ representation has **not** received Owner/SA religious sign-off. No AI Code integration authorized.

## Integration draft (not runtime authorization)
- Coordinate system: 1080×1920; every PNG registration and pivot is **top-left (0,0)**; native/source generation canvas 941×1672 then scaled.
- Draw `layers/*.png` in numeric filename order, default normal alpha blending. Do not independently transform without updating masks/occlusion.
- Composite generated from these layers and rebuild tested pixel-exact: **True**. No animation or app code changes.
- No external church photo, parish logo, copyrighted music or third-party image intentionally imported. AI-generated rights, depiction and any training/license concerns remain a required SA/Owner approval gate.

## Mechanical QA (performed)
- All images valid PNG, 1080×1920.
- Pixel-exact visual composite from the exported layers: **PASS**.
- SHA256 and PNG alpha statistics recorded in manifest. Breakdown:
- `00_background_backdrop.png`: alpha 255..255; 0% alpha = 0.00%, 255 = 100.00%
- `01_bg_architecture.png`: alpha 0..255; 0% alpha = 41.71%, 255 = 0.06%
- `02_stained_glass_left.png`: alpha 0..255; 0% alpha = 98.15%, 255 = 0.02%
- `03_stained_glass_right.png`: alpha 0..255; 0% alpha = 97.94%, 255 = 0.02%
- `04_stained_glass_central.png`: alpha 0..255; 0% alpha = 98.55%, 255 = 1.18%
- `05_floor_and_side_lane.png`: alpha 0..255; 0% alpha = 60.49%, 255 = 0.02%
- `06_sanctuary_protected.png`: alpha 0..255; 0% alpha = 88.71%, 255 = 0.06%
- `07_pews_left_occluder.png`: alpha 0..255; 0% alpha = 88.75%, 255 = 0.03%
- `08_pews_right_occluder.png`: alpha 0..255; 0% alpha = 94.96%, 255 = 0.01%

## Open blockers / SA review requests
1. **Religious iconography:** exact Christ crucifix depiction and altar design unapproved. Do not treat concept approval as image approval; Marian depiction not delivered.
2. **Composition/art defects:** perspective is painterly and the generated sanctuary uses a double depth arch. Side-floor is **slightly raised**, and the new lane's transition plus right pew occlusion needs redraw/visual review before actor path claims. The extracted center stained-glass crop may show edge mismatches/soft halos. Revisit if pixel-perfect production is required.
3. **Geometry not final:** candidate `protected_sanctuary` and `reserved_marian_no_art` zones are approximate; no deterministic collision tests, camera/parallax transform QA, animated gift exclusion or LIVE Studio capture run. Do not load JSON in runtime.
4. **Source resolution:** generated source planes 941×1672 resampled to 1080×1920; final pixel-density quality needs inspection, especially stained glass, altar and pew edges.
5. **UI safe areas:** top y=0..150 and bottom y=1770..1920 shown on technical overlay, but Studio/mobile overlays still unmeasured. No baked UI text in preview.
6. **Repository upload:** binary Git push via current environment unavailable; Owner must use supplied ZIP/commands. No PR/head SHA can be claimed until remote verified.

**Next decision needed from SA/Owner:** accept/revise Batch A art direction and geometry only. Batch B, C, D and TASK-002B integration remain blocked pending explicit authorization. Do not merge the visual Draft PR.
