# OnlineChurch VisualReview — Review-only Art Inbox

This folder is **not production assets**. The Owner has authorized Visual AI to upload images **on per-batch review branches only**, normally in Draft PRs that **MUST NOT be merged into main**. Applications never load images from `VisualReview/`.

Use: `VisualReview/<Concept>/<Batch>/`, e.g. `VisualReview/Concept03/Batch-A/`, branch `visual/concept03-batch-a-review`.
Each batch requires `composite_preview.png`, `technical_overlay.png` when relevant, `layers/*.png`, `manifest.csv`, `handoff.md`; masks are candidate-only until Owner/SA approval.

See [Design/16_VISUAL_REVIEW_REPO_WORKFLOW.md](../Design/16_VISUAL_REVIEW_REPO_WORKFLOW.md) for exact rules. Do not put secrets, identifiable users or unlicensed third-party materials into this public repository.
