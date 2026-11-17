# Batch C — Pose/contact QA (R1, draft)

**Scope:** one fictional ordinary visitor, no clergy or liturgical action; sprite animation proposals only, never production integration.

- Canvas: **256×384 transparent RGBA** per frame; top-left sprite registration `(0,0)`; common logical pivot **(128,347)**. The pivot is a logical root at floor level: every frame aligns the lowermost opaque shoe/knee pixel to **y=347**, but **x=128 is an approximate actor root rather than the support-toe x-coordinate**. It is **not** a guarantee that both feet stay planted in walk/in-betweens.
- Scene space: **1080×1920** in Batch A; suggested example registration on aisle near `(540,1600)`, origin centered on sprite root, depth derived from `root_y_scene`. Suggested far-to-near scene scale: 0.5–1.0; **DRAFT pending SA/Developer state/camera contracts**.
- Source: one 4×4 OpenAI ImageGen painterly character pose sheet. Every crop uses common scale factor **0.89**, not bounding-box normalized. Original artist source is approximately 1199×1312, 4×4 poses. Transparent alpha was cleaned (<25 discarded, >=222 opaque) and anti-aliased edges decontaminated against nearest interior RGB. No real-person likeness.
- Seat imagery: generated reference cells 2,1 and 2,2 included a temporary wooden chair. A **hand-authored person cutout** removes the most visible chair region; seated and sit_down still require visual inspection on an actual empty pew. No chair is intended as part of final person sprites.
- Contact anchors: `animation_manifest.csv` includes per-frame foot pivot (128,347), and `contact_x/y`/hip/knee **DRAFT landmark approximations**. No ground-truth bone tracking. Actual stance foot, sitting hip-to-pew and kneeling knee-to-floor must be adjusted under SA sprite review.
- Turn: four/five key view transitions front/three-quarter/side/back, not a geometrically continuous 3D skeletal rotation; turn frames are **key drawings** with distinct orientation.
- Walk: six frames per direction; derived from four original walking key drawings with limited ±1–2px bob/registration. **Repeated source cells occur**; this is a review candidate and may show stride cadence discontinuities or foot sliding. DO NOT mark as seamless locomotion until visual acceptance and motion tuning.
- Sit, kneel, stand-up: pose-derived keyframe transitions with 5–6 frames, not true IK. Expects review for realistic joint continuity, contact placement and adjacent-frame proportional consistency.
- QA dark/light: `qa/*_dark_light.webp` composites selected alpha frames against `#f6f0e7` and `#17202f`.
- QA reproducibility: `python qa_animation.py` checks native dimensions, meaningful alpha, pivot, atlas/frame pixel equality, manifest byte hashes. This is **asset structure QA only**, not natural motion, collision, foot-lock, or PixiJS QA.
- Preview: `motion_preview.gif` is an actual rendered sequence with per-frame manifest timings for the selected states; `contact_sheet_review.webp` is for quick SA inspection; scene mockup uses the earlier accepted-reference Batch A art purely as a visual illustration, **not integrated runtime**.

**Still HOLD:** natural walking and no-sliding motion acceptance, clean cutout and chair omission at 200%, real seat/knee anchor fit, frame pacing, visual iconography, camera/parallax/mask navigation, owner content/rights approval, TASK-003B integration.
