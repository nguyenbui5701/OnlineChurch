/** Pure logical geometry. No renderer, platform profiles, or approved art data. */
export const LOGICAL_WIDTH = 1080;
export const LOGICAL_HEIGHT = 1920;
/** Points within this distance of an edge are treated as touching (denied). */
export const GEOMETRY_EPSILON = 0.000001;
export interface Point { readonly x: number; readonly y: number }
export type Polygon = readonly Point[];
export interface OccupiedBounds extends Point { readonly width: number; readonly height: number }
export interface ViewportFit {
  readonly width: number; readonly height: number;
  readonly scale: number; readonly offsetX: number; readonly offsetY: number;
}
export interface SyntheticZones {
  readonly schemaVersion: 1;
  readonly status: 'SYNTHETIC_DEMO_ONLY';
  readonly coordinateSpace: 'LOGICAL_1080_1920';
  readonly navigation: readonly Polygon[];
  readonly fx: readonly Polygon[];
  readonly protected: readonly Polygon[];
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
function point(value: unknown): value is Point {
  return object(value) && finite(value.x) && finite(value.y);
}
function onCanvas(value: Point): boolean {
  return value.x >= 0 && value.x <= LOGICAL_WIDTH && value.y >= 0 && value.y <= LOGICAL_HEIGHT;
}
function distance(a: Point, b: Point): number { return Math.hypot(a.x - b.x, a.y - b.y); }
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
function side(a: Point, b: Point, c: Point): number {
  const value = cross(a, b, c);
  return Math.abs(value) <= GEOMETRY_EPSILON * distance(a, b) ? 0 : Math.sign(value);
}
function onSegment(p: Point, a: Point, b: Point): boolean {
  return side(a, b, p) === 0 && p.x >= Math.min(a.x, b.x) - GEOMETRY_EPSILON
    && p.x <= Math.max(a.x, b.x) + GEOMETRY_EPSILON && p.y >= Math.min(a.y, b.y) - GEOMETRY_EPSILON
    && p.y <= Math.max(a.y, b.y) + GEOMETRY_EPSILON;
}
function edges(polygon: Polygon): [Point, Point][] {
  return polygon.map((p, index) => [p, polygon[(index + 1) % polygon.length]!]);
}
function segmentsTouch(a: Point, b: Point, c: Point, d: Point): boolean {
  if (onSegment(a, c, d) || onSegment(b, c, d) || onSegment(c, a, b) || onSegment(d, a, b)) return true;
  return side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0;
}

/** Simple unclosed polygons, 3..64 distinct vertices, no collinear corners.
 * Reject degeneracies rather than trying to repair untrusted mask geometry.
 */
export function isValidPolygon(value: unknown): value is Polygon {
  if (!Array.isArray(value) || value.length < 3 || value.length > 64
    || !Array.from(value).every(p => point(p) && onCanvas(p))) return false;
  const polygon = value as Point[];
  for (let i = 0; i < polygon.length; i++) {
    for (let j = i + 1; j < polygon.length; j++) {
      if (distance(polygon[i]!, polygon[j]!) <= GEOMETRY_EPSILON) return false;
    }
    if (side(polygon[i]!, polygon[(i + 1) % polygon.length]!, polygon[(i + 2) % polygon.length]!) === 0) return false;
  }
  const lines = edges(polygon);
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (j === i + 1 || (i === 0 && j === lines.length - 1)) continue;
      if (segmentsTouch(...lines[i]!, ...lines[j]!)) return false;
    }
  }
  return Math.abs(lines.reduce((sum, [a, b]) => sum + a.x * b.y - b.x * a.y, 0)) > GEOMETRY_EPSILON;
}

function location(p: Point, polygon: Polygon): 'inside' | 'outside' | 'boundary' {
  let inside = false;
  for (const [a, b] of edges(polygon)) {
    if (onSegment(p, a, b)) return 'boundary';
    if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside ? 'inside' : 'outside';
}

export function pointInPolygon(p: unknown, polygon: unknown): 'inside' | 'outside' | 'boundary' | 'invalid' {
  return point(p) && onCanvas(p) && isValidPolygon(polygon) ? location(p, polygon) : 'invalid';
}

/** Conservative collision predicate: invalid input also returns true (unsafe). */
export function polygonsIntersect(a: unknown, b: unknown): boolean {
  if (!isValidPolygon(a) || !isValidPolygon(b)) return true;
  if (edges(a).some(([p, q]) => edges(b).some(([r, s]) => segmentsTouch(p, q, r, s)))) return true;
  return location(a[0]!, b) !== 'outside' || location(b[0]!, a) !== 'outside';
}

export function boundsPolygon(value: unknown): Polygon | null {
  if (!point(value) || !object(value) || !finite(value.width) || !finite(value.height)
    || value.width <= GEOMETRY_EPSILON || value.height <= GEOMETRY_EPSILON) return null;
  const right = value.x + value.width;
  const bottom = value.y + value.height;
  const result = [{ x: value.x, y: value.y }, { x: right, y: value.y }, { x: right, y: bottom }, { x: value.x, y: bottom }];
  return isValidPolygon(result) ? result : null;
}

export function isValidSyntheticZones(value: unknown): value is SyntheticZones {
  if (!object(value) || value.schemaVersion !== 1 || value.status !== 'SYNTHETIC_DEMO_ONLY'
    || value.coordinateSpace !== 'LOGICAL_1080_1920') return false;
  return ['navigation', 'fx', 'protected'].every(key => {
    const regions = value[key];
    return Array.isArray(regions) && regions.length > 0 && regions.length <= 16 && Array.from(regions).every(isValidPolygon);
  });
}

export interface PlacementDiagnostic {
  readonly geometryAllowed: boolean;
  readonly renderEligible: false;
  readonly reason: 'INVALID_GEOMETRY' | 'INVALID_MASKS' | 'INVALID_REGION' | 'PROTECTED_OVERLAP' | 'OUTSIDE_ALLOWED' | 'SYNTHETIC_ONLY';
}
/** Diagnostic ONLY: a geometrically safe synthetic candidate never authorizes rendering. */
export function diagnosePlacement(bounds: unknown, zones: unknown, region: unknown): PlacementDiagnostic {
  const denied = (reason: PlacementDiagnostic['reason']): PlacementDiagnostic => ({ geometryAllowed: false, renderEligible: false, reason });
  const candidate = boundsPolygon(bounds);
  if (!candidate) return denied('INVALID_GEOMETRY');
  if (!isValidSyntheticZones(zones)) return denied('INVALID_MASKS');
  if (region !== 'navigation' && region !== 'fx') return denied('INVALID_REGION');
  if (zones.protected.some(protectedRegion => polygonsIntersect(candidate, protectedRegion))) return denied('PROTECTED_OVERLAP');
  // Entire candidate must lie strictly inside ONE allowed polygon. Edge tests
  // prevent a rectangle straddling a concave cutout despite all corners fitting.
  const fits = zones[region].some(allowed => candidate.every(p => location(p, allowed) === 'inside')
    && !edges(candidate).some(([a, b]) => edges(allowed).some(([c, d]) => segmentsTouch(a, b, c, d))));
  return fits ? { geometryAllowed: true, renderEligible: false, reason: 'SYNTHETIC_ONLY' } : denied('OUTSIDE_ALLOWED');
}

/** No approved record loader exists in TASK-002. Forged APPROVED status is not authority.
 * A future reviewed task must introduce asset-hash-bound approvals and render admission.
 */
export function canRenderDynamic(_bounds: unknown, _zones: unknown, _kind: unknown): false { return false; }

export function fitViewport(width: unknown, height: unknown): ViewportFit | null {
  if (!finite(width) || !finite(height) || width < 1 || height < 1 || width > 100_000 || height > 100_000) return null;
  const scale = Math.min(width / LOGICAL_WIDTH, height / LOGICAL_HEIGHT);
  return { width, height, scale, offsetX: (width - LOGICAL_WIDTH * scale) / 2, offsetY: (height - LOGICAL_HEIGHT * scale) / 2 };
}
function validFit(value: unknown): value is ViewportFit {
  if (!object(value)) return false;
  const fit = fitViewport(value.width, value.height);
  return fit !== null && value.scale === fit.scale && value.offsetX === fit.offsetX && value.offsetY === fit.offsetY;
}
export function logicalToViewport(p: unknown, fit: unknown): Point | null {
  return point(p) && onCanvas(p) && validFit(fit)
    ? { x: p.x * fit.scale + fit.offsetX, y: p.y * fit.scale + fit.offsetY } : null;
}
export function viewportToLogical(p: unknown, fit: unknown): Point | null {
  if (!point(p) || !validFit(fit)) return null;
  const result = { x: (p.x - fit.offsetX) / fit.scale, y: (p.y - fit.offsetY) / fit.scale };
  if (result.x < -GEOMETRY_EPSILON || result.y < -GEOMETRY_EPSILON
    || result.x > LOGICAL_WIDTH + GEOMETRY_EPSILON || result.y > LOGICAL_HEIGHT + GEOMETRY_EPSILON) return null;
  return { x: Math.max(0, Math.min(LOGICAL_WIDTH, result.x)), y: Math.max(0, Math.min(LOGICAL_HEIGHT, result.y)) };
}
