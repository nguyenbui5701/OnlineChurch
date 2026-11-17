import { Container, Graphics, Text } from 'pixi.js';
import { canRenderDynamic } from '@onlinechurch/shared';
import type { Polygon } from '@onlinechurch/shared';
import { LAYER_ORDER, SYNTHETIC_ZONES } from './layout.js';
import type { LayerSlot } from './layout.js';

function label(layer: Container, text: string, x: number, y: number, size = 28, color = 0x36291f): Text {
  const node = new Text({ text, style: { fontFamily: 'Arial, sans-serif', fontSize: size, fill: color, align: 'center' } });
  node.anchor.set(0.5, 0);
  node.position.set(x, y);
  layer.addChild(node);
  return node;
}

export function createScene() {
  const stage = new Container({ label: 'logical-1080x1920', eventMode: 'none' });
  const slots = {} as Record<LayerSlot, Container>;
  for (const name of LAYER_ORDER) {
    const layer = new Container({ label: name, eventMode: 'none' });
    slots[name] = layer;
    stage.addChild(layer);
  }
  // No public insertion API or approved mask loader in TASK-002. Both future
  // dynamic slots stay empty AND non-renderable, even if code inserts a child.
  slots.visitors.renderable = canRenderDynamic(null, SYNTHETIC_ZONES, 'visitor');
  slots.fx.renderable = canRenderDynamic(null, SYNTHETIC_ZONES, 'fx');

  const back = new Graphics().rect(0, 0, 1080, 1920).fill(0xf5e9d4);
  for (let i = 0; i < 3; i++) {
    const inset = 80 + i * 70;
    back.roundRect(inset, 205 + i * 70, 1080 - inset * 2, 850 - i * 65, 210 - i * 40)
      .stroke({ width: 22 - i * 3, color: [0xd7c4a0, 0xe0ceb1, 0xcab38c][i]! });
  }
  back.roundRect(125, 480, 100, 235, 45).fill(0xb5c3c1)
    .roundRect(855, 480, 100, 235, 45).fill(0xb5c3c1);
  slots.far.addChild(back);
  label(slots.far, 'HÌNH HỌC MẪU · CHƯA CÓ ARTWORK', 540, 190, 28);

  slots.sanctuary.addChild(new Graphics().roundRect(345, 430, 390, 405, 90).fill(0xe2d3b8)
    .rect(310, 840, 460, 32).fill(0xb8a17d).rect(280, 880, 520, 28).fill(0xc9b591));
  label(slots.sanctuary, 'VÙNG TĨNH', 540, 610, 36);
  label(slots.sanctuary, 'Placeholder · Không tương tác', 540, 668, 24);

  const floor = new Graphics().poly([0, 980, 1080, 980, 1080, 1770, 0, 1770]).fill(0xe4d7c1)
    .poly([485, 990, 595, 990, 745, 1770, 335, 1770]).fill(0xf8efdE);
  for (let row = 0; row < 5; row++) {
    const y = 1050 + row * 112;
    const width = 230 + row * 22;
    floor.roundRect(420 - width, y, width, 45, 6).fill(0x9c8260)
      .roundRect(660, y, width, 45, 6).fill(0x9c8260);
  }
  slots.floor.addChild(floor);
  slots.foreground.addChild(new Graphics().roundRect(45, 1645, 280, 110, 8).fill(0x6e5c45)
    .roundRect(755, 1645, 280, 110, 8).fill(0x6e5c45));

  const guides = new Container({ label: 'synthetic-guides' });
  const polygon = (points: Polygon, color: number) => new Graphics().poly(points.flatMap(p => [p.x, p.y]))
    .fill({ color, alpha: 0.10 }).stroke({ color, width: 4 });
  for (const region of SYNTHETIC_ZONES.protected) guides.addChild(polygon(region, 0x9b4537));
  for (const region of SYNTHETIC_ZONES.navigation) guides.addChild(polygon(region, 0x426b63));
  for (const region of SYNTHETIC_ZONES.fx) guides.addChild(polygon(region, 0x666a92));
  guides.addChild(new Graphics().moveTo(0, 150).lineTo(1080, 150).moveTo(0, 1770).lineTo(1080, 1770).stroke({ color: 0x725b36, width: 3 }));
  label(guides, 'SYNTHETIC_DEMO_ONLY', 540, 935, 26, 0x80372d);
  label(guides, 'Nav mẫu', 540, 1480, 24, 0x284a42);
  label(guides, 'FX mẫu', 885, 1550, 22, 0x383954);
  slots.ui.addChild(guides);
  slots.ui.addChild(new Graphics().rect(0, 0, 1080, 150).fill(0x302c25).rect(0, 1770, 1080, 150).fill(0x302c25));
  label(slots.ui, 'ONLINECHURCH   /   DEMO · OFFLINE', 540, 35, 36, 0xfff7e9);
  label(slots.ui, '1080 × 1920 · Canvas hình học mẫu', 540, 91, 26, 0xe6d5b5);
  label(slots.ui, 'Không gian mô phỏng — không phải Thánh lễ hay bí tích', 540, 1790, 29, 0xfff7e9);
  label(slots.ui, 'MASKS NOT APPROVED — DEMO ONLY', 540, 1846, 30, 0xf5d496);
  return { stage, setGuides: (visible: boolean) => { guides.visible = visible; } };
}
