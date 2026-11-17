# Concept 03 — Visual Agent handoff (repository transcription)

Source: user-supplied `SA_CONCEPT03_HANDOFF.md` dated 2026-11-17. This file retains essential handoff semantics for other agents; for original uploaded source byte/hash and SA verdict, see `../13_CONCEPT03_SA_VISUAL_REVIEW.md`.

**Owner-selected concept:** 03 Romanesque golden-ivory nave, the *third painterly illustration*, not older vector `concept_C_1080x1920.png`.
**Status:** ART DIRECTION SELECTED; actual Christ and Marian artwork, final sacred polygon, 2.5D RGBA layer cutouts, rights and Studio capture are still on hold.

## Visual and current source
- Warm Romanesque rounded arches and stone columns, ivory sandstone, wooden pews, golden light, stained-glass windows.
- Central crucifix with figure of Jesus; protected altar/chancel; left Marian niche; right side stand in concept; central aisle.
- Original 941×1672 RGB preview was upscaled to 1080×1920 for planning only. The supplied PNG is a fully opaque RGBA composite, **not** transparent layered production material. No characters, UI text or real branding are baked into the original concept.

## Mandatory corrections
1. Existing right-side candle shelf at front is **not an accessible votive interaction**. Recompose right-side aisle/pews to permit safe side votive access outside the protected sanctuary.
2. Verify religious depiction of Christ and Mary with Owner; request Catholic specialist input on ambiguous details.
3. Ensure UI-safe zones y=0..150 and y=1770..1920 in real 9:16 Studio preview.
4. Keep static architecture static; render flames/gifts separately, masked away from Christ/Mary/altar/sanctuary.
5. Produce original clean transparent planes; naive crops from the flat preview are not accepted.

## Layer order
1. Far nave/windows.
2. Sanctuary architecture / Christ crucifix / static altar — protected.
3. Left Marian niche and right-side votive stand — Marian image protected; votive interaction only in redesigned safe side lane.
4. Diffuse environmental light.
5. Back pews, floor, aisle.
6. Visitors in approved nav regions.
7. Front pew occluders / plants.
8. Side candle glow and neutral gift FX in allowed masks.
9. UI/disclosure overlay.

## Provisional coordinate bands — never treat as final runtime masks
- Header y=0..150; lower footer y=1770..1920.
- Sanctuary x=225..855, y=352..1105; independently protect Christ/Mary.
- Marian x=45..292, y=602..1090.
- Existing candle display x=845..1050, y=790..1108 (inaccessible).
- New side candle candidate x=810..1062, y=1200..1468 (**must recompose current pews**).
- Visitor aisle x~465..615 at y~1127, widening x~365..720 near y~1736.

## Gate order
V1 concept review by SA/Owner; Batch A original architectural layers; Batch B Marian/candle side region; Batch C modest visitor walk/idle/sit/kneel sprites; Batch D ambient/floral safe FX and quiet mode. Final approval needs 1080×1920 layer registration, no halos, pivots, hashes/provenance/license, mask JSON after final approved art, deterministic forbidden-overlap tests and real Studio capture.

**Asset planning:** `manifest_CONCEPT03_PROPOSAL.csv`, 24 rows, remains a proposal; it does not certify completion or licensing. Actual uploaded preview and overlay images are *not* versioned by this repository documentation commit.
