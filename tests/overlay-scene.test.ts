import { describe, expect, it } from 'vitest';
import { createScene } from '../apps/overlay/src/scene.js';
import { LAYER_ORDER } from '../apps/overlay/src/layout.js';

describe('Pixi scene structure (no WebGL rendering claimed)', () => {
  it('preserves depth ordering and keeps future dynamic slots empty and non-renderable', () => {
    const scene = createScene();
    try {
      expect(scene.stage.children.map(child => child.label)).toEqual([...LAYER_ORDER]);
      for (const name of ['visitors', 'fx']) {
        const slot = scene.stage.getChildByLabel(name)!;
        expect(slot.children).toHaveLength(0);
        expect(slot.renderable).toBe(false);
      }
      const guide = scene.stage.getChildByLabel('synthetic-guides', true)!;
      expect(guide.visible).toBe(true);
      scene.setGuides(false);
      expect(guide.visible).toBe(false);
      const ui = scene.stage.getChildByLabel('ui')!;
      expect(ui.visible).toBe(true);
      expect(ui.children.length).toBeGreaterThan(1);
    } finally { scene.stage.destroy({ children: true }); }
  });
});
