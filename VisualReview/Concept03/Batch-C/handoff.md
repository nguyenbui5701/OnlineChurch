# OnlineChurch — Visual Batch C / Review R1

- **Source Design:** `Design/18_FASTTRACK_ROADMAP_AND_VISUAL_BATCH_C.md` on merged main (PR #8 merged, verified).
- **Branch requested:** `visual/concept03-batch-c-review` from main.
- **Scope:** one ordinary, modestly dressed fictional visitor: standing, walk left/right (6 frames each), turn, sit down/hold/stand, kneel down/hold/get up, return, leave; total 13 animation groups, sprite native **256×384 RGBA**. **No clergy/ritual/mass**.
- **Status:** `SUBMITTED_FOR_SA_REVIEW / NOT_APPROVED`. No source, Design, Task or other Batch edited. No app integration or PR merge.

## Review entry points
- `contact_sheet_review.webp` — all actual sprite key poses and durations, small GitHub-viewable.
- `scene_mockup_review.webp` — review-only scale example over Batch A reference scene, **not** production app.
- `motion_preview.gif` — one continuous sample over several states; keyframe transitions require animation polish.
- `animation_manifest.csv`, `atlas_manifest.json` — per-frame duration, rectangle, root pivot, contact-point draft and source cell.
- `frames/` — independent RGBA frame PNGs; `atlases/` — per-state registered transparent strips.
- `qa_animation.py`, `QA_POSE_CONTACT.md`, `qa/` — reproducible structural test and matte comparisons.
- `manifest.csv` — actual image and metadata hashes, rights and review status.

## Constraints / reviewer actions
1. **SA actor contracts:** Approve or refine root pivot (128,347), scene scale, separate seat/knee/root point conventions and per-state timing.
2. **Art motion QA pending:** 6-frame walk key draws reuse some source cells and limited bob; need SA review for foot slide, knees, arm swing and transition continuity. Generated contacts are illustrations, NOT biomechanical motion capture or true IK. No user can infer a 'motion naturalness PASS' from structural QA.
3. **Seated cutout provisional:** person-only keyframes were isolated from a reference with a wooden seat; check mask edge and silhouette on real pew (Batch A remains a reference only).
4. **Scene integration HOLD:** final geometry, sacred protected mask, Catholic iconography, runtime camera, collisions and owner rights approval outstanding.
5. **Repository:** branch and Draft PR must be verified on GitHub before reporting a real HEAD SHA or PR URL. **No assumption that a download ZIP equals push.**

**Nothing in Batch C grants permission to integrate images into TASK-003 synthetic-only demo or deploy.**
