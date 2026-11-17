import { describe, expect, it } from 'vitest';
import {
  boundsPolygon, canRenderDynamic, diagnosePlacement, fitViewport, GEOMETRY_EPSILON,
  isValidPolygon, isValidSyntheticZones, logicalToViewport, pointInPolygon,
  polygonsIntersect, viewportToLogical,
} from '@onlinechurch/shared';
import { SYNTHETIC_ZONES } from '../apps/overlay/src/layout.js';

const box = (x: number, y: number, width: number, height: number) => [
  { x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height },
];
const square = box(100, 100, 200, 200);
const validBounds = { x: 500, y: 1200, width: 50, height: 50 };

describe('simple logical polygons and conservative contact semantics', () => {
  it('accepts clockwise/counterclockwise polygons, rejects closed duplicates', () => {
    expect(isValidPolygon(square)).toBe(true);
    expect(isValidPolygon([...square].reverse())).toBe(true);
    expect(isValidPolygon([...square, square[0]])).toBe(false);
  });
  it.each([null, [], {}, [{ x: 1, y: 1 }], box(-1, 0, 10, 10), box(0, 0, 1081, 1920),
    box(0, 0, 1080, 1921), box(0, 0, NaN, 20), box(0, 0, Infinity, 20), box(0, 0, 0, 20),
    [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 20 }],
    [{ x: 10, y: 10 }, { x: 200, y: 200 }, { x: 10, y: 200 }, { x: 200, y: 10 }],
  ])('invalid geometry fails closed: %j', polygon => {
    expect(isValidPolygon(polygon)).toBe(false);
    expect(polygonsIntersect(polygon, square)).toBe(true);
    expect(pointInPolygon({ x: 150, y: 150 }, polygon)).toBe('invalid');
  });
  it('distinguishes inside/outside/edge and rejects invalid points', () => {
    expect(pointInPolygon({ x: 150, y: 150 }, square)).toBe('inside');
    expect(pointInPolygon({ x: 10, y: 150 }, square)).toBe('outside');
    expect(pointInPolygon({ x: 100, y: 150 }, square)).toBe('boundary');
    expect(pointInPolygon({ x: 100 - GEOMETRY_EPSILON / 2, y: 150 }, square)).toBe('boundary');
    for (const value of [null, { x: NaN, y: 10 }, { x: -1, y: 10 }]) expect(pointInPolygon(value, square)).toBe('invalid');
  });
  it('rejects sparse arrays without throwing at the public boundary', () => {
    expect(isValidPolygon(new Array(4))).toBe(false);
    expect(isValidSyntheticZones({ ...SYNTHETIC_ZONES, protected: new Array(1) })).toBe(false);
    expect(polygonsIntersect(new Array(4), square)).toBe(true);
  });
  it.each([
    ['contained', box(120, 120, 20, 20)], ['enclosing', box(50, 50, 300, 300)],
    ['crossing', box(200, 0, 20, 500)], ['touching edge', box(300, 120, 10, 10)],
    ['touching vertex', box(300, 300, 10, 10)], ['thin overlap', box(299.9999, 150, 10, 10)],
    ['within epsilon', box(300 + GEOMETRY_EPSILON / 2, 150, 10, 10)],
  ])('denies %s symmetrically', (_name, polygon) => {
    expect(polygonsIntersect(square, polygon)).toBe(true);
    expect(polygonsIntersect(polygon, square)).toBe(true);
  });
  it('accepts separated geometry beyond tolerance', () => {
    expect(polygonsIntersect(square, box(300 + GEOMETRY_EPSILON * 2, 150, 10, 10))).toBe(false);
  });
});

describe('placement diagnostics and render fail-closed gate', () => {
  it('valid synthetic navigation/FX diagnostics NEVER grant render eligibility', () => {
    expect(isValidSyntheticZones(SYNTHETIC_ZONES)).toBe(true);
    expect(diagnosePlacement(validBounds, SYNTHETIC_ZONES, 'navigation')).toEqual({ geometryAllowed: true, renderEligible: false, reason: 'SYNTHETIC_ONLY' });
    expect(diagnosePlacement({ x: 800, y: 1400, width: 30, height: 30 }, SYNTHETIC_ZONES, 'fx').geometryAllowed).toBe(true);
    for (const kind of ['visitor', 'candle', 'gift', 'donorLabel', 'fx', 'debug', null]) {
      for (const zones of [null, SYNTHETIC_ZONES, { ...SYNTHETIC_ZONES, status: 'APPROVED', assetHash: 'fake' }]) {
        expect(canRenderDynamic(validBounds, zones, kind)).toBe(false);
      }
    }
  });
  it.each([undefined, null, {}, { ...SYNTHETIC_ZONES, protected: [] }, { ...SYNTHETIC_ZONES, navigation: [] },
    { ...SYNTHETIC_ZONES, fx: [square, []] }, { ...SYNTHETIC_ZONES, schemaVersion: 2 },
    { ...SYNTHETIC_ZONES, status: 'APPROVED' }, { ...SYNTHETIC_ZONES, coordinateSpace: 'CONCEPT_941_1672' },
  ])('missing, invalid or conceptual masks denied %j', zones => {
    expect(isValidSyntheticZones(zones)).toBe(false);
    expect(diagnosePlacement(validBounds, zones, 'navigation').reason).toBe('INVALID_MASKS');
  });
  it.each([null, {}, { ...validBounds, width: -1 }, { ...validBounds, height: 0 }, { ...validBounds, x: -1 },
    { ...validBounds, width: Infinity }, { ...validBounds, x: NaN }, { ...validBounds, x: 1080 },
    { ...validBounds, y: 1919 }, { ...validBounds, width: GEOMETRY_EPSILON / 2 },
  ])('invalid occupied bounds denied %j', bounds => {
    expect(boundsPolygon(bounds)).toBeNull();
    expect(diagnosePlacement(bounds, SYNTHETIC_ZONES, 'navigation').reason).toBe('INVALID_GEOMETRY');
  });
  it('rejects overlapping and touching protected masks even inside an allowed region', () => {
    const zones = { ...SYNTHETIC_ZONES, navigation: [box(0, 0, 1080, 1920)], protected: [square] };
    for (const bounds of [{ x: 120, y: 120, width: 10, height: 10 }, { x: 300, y: 120, width: 10, height: 10 }]) {
      expect(diagnosePlacement(bounds, zones, 'navigation').reason).toBe('PROTECTED_OVERLAP');
    }
  });
  it('rejects allowed boundary touch, outside placement and unknown region', () => {
    const zones = { ...SYNTHETIC_ZONES, navigation: [square], protected: [box(600, 600, 100, 100)] };
    expect(diagnosePlacement({ x: 100, y: 120, width: 10, height: 10 }, zones, 'navigation').reason).toBe('OUTSIDE_ALLOWED');
    expect(diagnosePlacement(validBounds, zones, 'navigation').reason).toBe('OUTSIDE_ALLOWED');
    expect(diagnosePlacement(validBounds, zones, '__proto__').reason).toBe('INVALID_REGION');
  });
  it('rejects crossing a concave cutout even when all four corners are inside', () => {
    const concave = [{ x: 100, y: 100 }, { x: 400, y: 100 }, { x: 400, y: 400 }, { x: 300, y: 400 },
      { x: 300, y: 200 }, { x: 200, y: 200 }, { x: 200, y: 400 }, { x: 100, y: 400 }];
    expect(isValidPolygon(concave)).toBe(true);
    const zones = { ...SYNTHETIC_ZONES, navigation: [concave] };
    expect(diagnosePlacement({ x: 150, y: 250, width: 200, height: 30 }, zones, 'navigation').reason).toBe('OUTSIDE_ALLOWED');
  });
});

describe('viewport transforms and resizing', () => {
  it.each([[1080, 1920], [360, 640], [1920, 1080], [375, 812], [2400, 3000]])('round trips a letterboxed %d × %d viewport', (width, height) => {
    const fit = fitViewport(width, height)!;
    expect(fit.scale).toBe(Math.min(width / 1080, height / 1920));
    for (const original of [{ x: 0, y: 0 }, { x: 540, y: 960 }, { x: 1080, y: 1920 }]) {
      const restored = viewportToLogical(logicalToViewport(original, fit), fit)!;
      expect(restored.x).toBeCloseTo(original.x, 8);
      expect(restored.y).toBeCloseTo(original.y, 8);
    }
  });
  it.each([[0, 100], [-1, 100], [NaN, 100], [100, Infinity], [100001, 1], ['100', 100]])('invalid viewport %j × %j denied', (width, height) => {
    expect(fitViewport(width, height)).toBeNull();
  });
  it('rejects letterbox clicks, forged transforms and invalid coordinates', () => {
    const fit = fitViewport(1920, 1080)!;
    expect(viewportToLogical({ x: 0, y: 20 }, fit)).toBeNull();
    expect(logicalToViewport({ x: Infinity, y: 0 }, fit)).toBeNull();
    expect(logicalToViewport({ x: 10, y: 20 }, { ...fit, scale: 2 })).toBeNull();
    expect(viewportToLogical({ x: 10, y: 20 }, null)).toBeNull();
  });
});
