# Batch C R2 — Pose/contact QA for SA review

**Authority:** `REVISION_REQUIRED / SPRITE_PRODUCTION_HOLD`. This is a visual iteration, not runtime-certified animation.

## C1 — Furniture cutout
Removed the wooden cushion and pedestal from the seated human by tracing a tapered person silhouette along trousers and legs (not masking a rectangular patch). The R2 seated pose and the terminal `sit_down`/initial `stand_up` poses are the same human-only RGBA raster. Review `qa/seated_r2_dark_light.webp` and `qa/person_only_on_blank_pew.webp`. These diagnostics do not prove a flawless semantic mask or fit with the real Batch A pew; please inspect at 200%.

## C2 — Walk
Expanded each direction from 6 (4 source) to 8 individually different frames. Four intermediate drawings use bidirectional optical-flow interpolation across four source poses. `return` and `leave` reuse the same ordered *candidate* left-facing cycle; no keyframe shuffling. Frame-level intended `frame_phase`, `stance_foot`, and `duration_ms` are in CSV. `qa/walk_scene_scale_flat_lane.webp` shows frames on a constant-height floor. **Neither frame uniqueness nor a fixed sprite pivot proves foot-locked locomotion**; the underlying source drawings still bias one lead leg and may need fresh artist keyframes.

## C3 — No fake hold animations
`idle_stand`, `seated`, and `kneel_hold` now use `STATIC_HOLD` with one frame. The 1000 ms metadata is an inspection duration only; runtime hold length belongs to the state machine. No claim of breathing animation.

## C4 — Contacts and pivots
Every frame records `display_pivot`, `root_foot`, a bottom-pixel measured `support_foot`, and separate *draft* hip/knee/seat/knee-floor fields. The pivot `(128,347)` is a sprite-display origin, not guaranteed physical support. Hip/seat/knee values are estimated per transition phase, NOT IK or body tracking. Seat contact requires alignment to a production pew/camera.

## C5 — Transitions and turns
Sit/down and stand/up have seven reverse-matched poses (two morph intermediates); kneel and get-up six reverse-matched poses. Four turn views per direction remain key illustrations, not continuous 3D rotation. `motion_preview.gif` uses per-frame CSV durations.

## C6 — Reproducible tests
Run `python qa_animation.py`. Tests: native 256×384 RGBA, nontrivial alpha, display pivot, sampled support pixels, unique walk raster hashes, STATIC_HOLD cardinality, atlas-to-frame pixel equality, animation durations, manifest SHA256 and known chair-footprint opaque region. Visual review must separately evaluate chair-free outline, ankle/hip continuity, true footplant, and real seat collision.

**HOLD:** Physical foot sliding, body-angle/phase fidelity, animation curve transitions, scene-scale anchors, copyright/AI art rights, Catholic scene masks, integration approval. No application source changes.
