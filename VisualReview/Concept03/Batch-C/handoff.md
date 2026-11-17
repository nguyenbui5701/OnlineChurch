# OnlineChurch — Visual Batch C / Revision R2 on PR #9

**Review URL:** https://github.com/nguyenbui5701/OnlineChurch/pull/9
**Branch:** `visual/concept03-batch-c-review`
**SA-reviewed R1 SHA:** `b37d2ecb8f3f212c31cd6f80145d5da418d98f81`
**Status:** `R2_PREPARED_FOR_SA_REVIEW / PRODUCTION_HOLD` — R2 push must be verified separately. DO NOT MERGE.

## Changes against R1
- C1: chair/cushion/pedestal area contour-traced out of seated person. Sit-down and stand-up share person-only final pose. QA on light/dark/wood backgrounds plus blank-pew test.
- C2: replaced six-frame walk with eight distinct frames including optical-flow in-betweens; return/leave reuse ordered direction-matched cycle; intended plant/swing phases annotated.
- C3: idle, seated, kneel hold are honestly declared STATIC_HOLD (one frame each).
- C4: per-frame `display_pivot`, `root_foot`, raster-measured `support_foot`, hip/seat/knee contacts in `animation_manifest.csv`. Draft artist estimates, not IK.
- C5: seven-step symmetric sit/get-up and six-step kneel/get-up, preserved directional turn keys and retimed GIF.
- C6: regenerated frame PNGs, atlases, timing manifests, QA images, GIF and SHA256 manifest; added structural duplicate and furniture-region tests.

## Review entry points
`contact_sheet_review.webp`, `motion_preview.gif`, `qa/person_only_on_blank_pew.webp`, `qa/walk_scene_scale_flat_lane.webp`, `QA_POSE_CONTACT.md`, `qa_animation.py`, `animation_manifest.csv`, `atlas_manifest.json`, `manifest.csv`.

## Remaining HOLD
Natural walk/foot-lock is not fully validated: four source walk drawings still favor one leading leg, and optical flow can deform textures. Sitting contact needs real blank church pew and measured seat transform. Transition biomechanics and turn coherence require SA approval. Art provenance/rights are `OWNER_SA_REVIEW_PENDING`. No real actors, sacred masks, PixiJS tests or application integration. This only updates `VisualReview/Concept03/Batch-C/**`.
