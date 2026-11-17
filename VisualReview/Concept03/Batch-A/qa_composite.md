# Batch A R1 — Visual review and registration QA

Run `python qa_composite.py` from any working directory after installing `Pillow numpy opencv-python`.

- 9 layers, 1080x1920 native file canvas. All `RGBA`; base layer deliberately opaque.
- Sort `layers/*.png` lexically from `00_background_backdrop` to `08_pews_right_occluder`, apply straight-alpha PIL `alpha_composite` at (0,0), then save RGB as PNG. Exact equality with `composite_preview.png` is asserted.
- Every manifest SHA256 is computed from real file bytes. WebP review sizes must be <=1,000,000 bytes.
- 100% and 200% `qa/*.webp` crops compare dark `#121823` with light `#f6f0e7` backgrounds for all three stained-glass windows, sanctuary and two pews.
- Non-base cutouts: `alpha <= 35` zero, `alpha >= 225` fully opaque; intermediate values edge antialias. Edge RGB pulled from nearest opaque pixels to reduce halos. No direct mutation of religious iconography textures beyond alpha edges.
- The 25 px **candidate line stroke** has no intersection with alpha >25 in `06_sanctuary_protected`, `07_pews_left_occluder` or `08_pews_right_occluder` on the static 1080x1920 canvas. **Not a live collision/camera validation**.
- Floor region uses reprojected pixels from existing `05_floor_and_side_lane.png`, with removed raised lip. This is a visual recompose requiring further perspective/art scrutiny.

## Executed command and outcome

```bash
python qa_composite.py
```

**RESULT (local Visual AI check): PASS** for manifest hashes, composition equality, dimensions, alpha and image-space 25 px route overlaps. **NOT SA TESTED; NOT RUNTIME APPROVED.**

Expected recomposed-preview PNG SHA256: `e868e67d63efc99b2669ed1049842906979260c5db3e0f5f65da250d44b16771`
