# 13 — Concept 03 SA Visual Review and Production Gate

**Date:** 2026-11-17 | **Status:** **SELECTED ART DIRECTION / PRODUCTION ASSETS HOLD** (TASK-002 synthetic renderer work may run in parallel; real images stay held)
**Owner selection:** Concept **03 — Romanesque Golden-Ivory Nave** (third painterly illustration, not the older vector layout `concept_C_1080x1920.png`).
**SA decision:** **ACCEPT for visual architecture and 2.5D planning**; **NOT ACCEPT as ready-to-integrate layered art, polygon/masks or approved Catholic depiction**. Do not send this preview to AI Code as a production sprite.

## Source evidence inspected in this review
- `SA_CONCEPT03_HANDOFF.md` — uploaded 2026-11-17; SHA256 `80cc62ca29d4712512d25c5f7694b59b970113f020735deda53aaf3cc4897fb3`.
- `manifest_CONCEPT03_PROPOSAL.csv` — uploaded 2026-11-17; SHA256 `84282d5f6fa1cb8d77a6841784ff0fbedfed83b399975d91b9ef174ecdbcb260`; **24 proposed rows:** 17 PROPOSED, 6 APPROVAL HOLD, 1 REVIEW CONCEPT ONLY.
- `concept03_selected_1080x1920_REVIEW.png` — source provided in conversation as `concept03_selected_1080x1920_REVIEW(1).png`; SHA256 `824744821420ec43026da9894e27a0c4ec9fb09208d5856679d39b60027bee9d`; 1080×1920 PNG RGBA, **alpha uniformly 255**, 4,329,185 bytes, no usable transparency or independent parallax layers. Visual handoff says original 941×1672 RGB, upscaled to 1080×1920; not native-production resolution.
- `concept03_technical_overlay_REVIEW.jpg` (uploaded `(1).jpg`) SHA256 `e7b8a624c577b2901f980549862bb99745a0c814b577bc39744ed707352a5703`; 1080×1920 RGB, **diagram only**, not a runtime polygon mask. Neither image is committed to the repo by this documentation PR.
- Manifest preview row says `PNG RGB`, but inspected file is **RGBA opaque**. Correct the manifest description to `PNG RGBA (fully opaque)` before production; the important fact is no true alpha cutout.

## Composition accepted
- Warm Romanesque rounded stone arches, columns, golden-ivory light, muted stained glass; central Christ crucifix as primary focal point.
- Fictional non-branded Catholic environment with left Marian niche, two banks of wooden pews, clear central aisle, and right-side votive concept.
- Modest visitor experience; no clergy character, sacrament or paid prayer. Mary and Christ final representations require explicit Catholic visual/content review, not assumed from concept acceptance.

## Required corrections before any asset-integrating TASK-002
1. **Votive interaction:** original right shelf appears close to sanctuary (roughly x=845..1050, y=790..1108). It may remain a **static distant decoration**, but **no visitor navigates there**. Propose new accessible votive kiosk on the **right-side** outside sanctuary near x=810..1062, y=1200..1468; this overlaps existing pew geometry in concept, so **redesign/recompose the pews/side lane**, do not place candle/avatar on top of bench.
2. **Sacred masks:** protected sanctuary candidate x=225..855, y=352..1105 plus independent Marian and crucifix protection. Numbers are concept-only, **not** a deployed safety polygon. Final art must produce explicit `sacred_protected_polygon.json`, `visitor_nav_regions.json`, `gift_safe_regions.json`; reject any actor, user name, gift/flame FX or candle overlap with sacred shapes, even one frame. Verify geometry and transformations at runtime (camera/parallax), not merely in static screenshot.
3. **Visitor paths:** nominal central aisle x=465..615 near y=1127 widening to x=365..720 by y=1736. Entry -> aisle -> pew/side reflection; stop before the sanctuary/chancel stairs, never allow path into altar. Seat/side coordinates must be reviewed against final layer art.
4. **UI overlay:** preserve header/disclosure y=0..150 and footer/chat hints y=1770..1920; confirm on actual TikTok LIVE Studio and phone preview before public use. No baked-in names or text in art. Use legible always-visible disclaimer: `Không gian nhà thờ Công giáo mô phỏng để suy niệm trực tuyến. Không phải Thánh lễ hay bí tích.`
5. **True 2.5D layers:** produce new, independently clean transparent PNG planes (architecture/sanctuary/Christ crucifix/Mary niche/altar/floor/pews/occluders/candle). The current flat upscaled photo cannot be turned into production layers by naive crops. Register planes to 1080×1920 coordinate system; no white halos, edge seams or duplicated objects.
6. **Lighting and gift FX:** background remains static; candle glow/flame and gift florals are separate sprites rendered only within safe masks. No strobe/flashing. Quiet mode mutes/suppresses audio and moving FX immediately. Never draw a flower/gift label across Christ, Mary or altar.
7. **Religious/rights acceptance:** no real parish implication, no simulated Mass, communion or clergy; review Christ and Mary imagery with Owner (and Catholic reviewer for ambiguity), plus original prompts/source, license, use rights and hashes.

## Visual AI handoff phases and gates
- **V1:** directions accepted; above corrections mandated. No actual source asset approved yet.
- **Batch A:** produce clean parallax architecture, floor, sanctuary and pew planes; composite preview; exact dimensions, pivots and alpha-edge inspection.
- **Batch B:** Marian imagery and relocated side votive stand, candle lit/unlit and flame. Pause for explicit Owner Catholic depiction acceptance.
- **Batch C:** fictional visitor sprite atlas walk/stand/sit/kneel, multiple views and animation/pivot metadata. No clergy.
- **Batch D:** ambient light and muted non-sacred floral gift effects plus quiet-mode variant.
- **Gate to AI Code:** SA/Owner approve manifest with provenance, license, SHA256, geometry and visually reviewed composite. Separate **TASK-002B** and specific Owner/SA asset approval required before **real image integration**. TASK-002 is an independent offline renderer foundation containing synthetic debug shapes only and must not consume any unapproved Concept 03 art. `manifest_CONCEPT03_PROPOSAL.csv` is a **proposal**, not proof that any listed asset has been produced.

## Technical validation for integration
- All screens, layers and mask coordinate systems register on 1080×1920.
- Collision checks for transformed actor/FX bounding geometry against final protected polygons are executable deterministic tests.
- Visual QA checks actual mobile LIVE Studio safe areas, quiet mode and legibility after compositing, not concept-only screenshot.
- Free prayer/candle must be visibly available without gift; no spiritual advantage bought by gifts.

**Change control:** This SA review does not create or change application source, merge a PR, or authorize production. The user-owned uploaded images remain in conversation unless explicitly transferred and reviewed for repository commit.

## 2026-11-17 — GitHub review delivery decision
Visual Agent's in-progress Batch A is to be delivered via `VisualReview/Concept03/Batch-A/` in branch `visual/concept03-batch-a-review`, with a Draft Visual PR and per-file manifest, not as individual images pasted into chat. Concept03 preview from the original chat is not automatically a production asset; it must be regenerated/validated. SA reviews repo-uploaded artifacts only when they exist and can be fetched/viewed. The review-branch images are NOT merged into `main` by default. See `16_VISUAL_REVIEW_REPO_WORKFLOW.md`.
