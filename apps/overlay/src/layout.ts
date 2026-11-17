import type { SyntheticZones } from '@onlinechurch/shared';

export const LAYER_ORDER = ['far', 'sanctuary', 'floor', 'visitors', 'foreground', 'fx', 'ui'] as const;
export type LayerSlot = typeof LAYER_ORDER[number];

// Independently authored synthetic geometry, deliberately not Concept 03 coordinates.
// These records have NO production approval, asset hashes, or sacred-mask authority.
export const SYNTHETIC_ZONES: SyntheticZones = {
  schemaVersion: 1,
  status: 'SYNTHETIC_DEMO_ONLY',
  coordinateSpace: 'LOGICAL_1080_1920',
  protected: [[{ x: 320, y: 380 }, { x: 760, y: 380 }, { x: 800, y: 900 }, { x: 280, y: 900 }]],
  navigation: [[{ x: 480, y: 1030 }, { x: 600, y: 1030 }, { x: 720, y: 1730 }, { x: 360, y: 1730 }]],
  fx: [[{ x: 780, y: 1330 }, { x: 990, y: 1330 }, { x: 990, y: 1690 }, { x: 780, y: 1690 }]],
};
