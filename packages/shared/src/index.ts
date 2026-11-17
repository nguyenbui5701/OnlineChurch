import { z } from 'zod';

export const SCHEMA_VERSION = 1 as const;
export const MAX_COMMAND_LENGTH = 80;
export const SourceModeSchema = z.enum(['DEMO', 'LIVE']);
export type SourceMode = z.infer<typeof SourceModeSchema>;
export const ChurchIntentSchema = z.enum(['ENTER', 'PRAY', 'LIGHT_CANDLE', 'PEACE', 'AMEN']);
export type ChurchIntent = z.infer<typeof ChurchIntentSchema>;

// Only opaque, bounded identifiers cross this boundary; no profile or raw chat fields.
const identifier = z.string().min(1).max(96).regex(/^[a-zA-Z0-9][a-zA-Z0-9:_-]*$/);
export const EventScopeSchema = z.object({
  source: SourceModeSchema,
  roomId: identifier,
  sessionId: identifier,
});
export type EventScope = z.infer<typeof EventScopeSchema>;
const envelope = {
  ...EventScopeSchema.shape,
  schemaVersion: z.literal(SCHEMA_VERSION),
  eventId: identifier,
  actorKey: identifier,
  timestamp: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
};
export const NormalizedEventSchema = z.discriminatedUnion('kind', [
  z.object({ ...envelope, kind: z.literal('enter') }),
  z.object({ ...envelope, kind: z.literal('command'), intent: ChurchIntentSchema }),
]);
export type NormalizedEvent = z.infer<typeof NormalizedEventSchema>;

/** Validate and scope an event without retaining unknown fields or sensitive text. */
export function parseScopedEvent(input: unknown, scope: unknown): NormalizedEvent | null {
  const expected = EventScopeSchema.safeParse(scope);
  const event = NormalizedEventSchema.safeParse(input);
  if (!expected.success || !event.success) return null;
  const data = event.data;
  return data.source === expected.data.source && data.roomId === expected.data.roomId
    && data.sessionId === expected.data.sessionId ? data : null;
}

export const ChurchSnapshotSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  source: SourceModeSchema,
  scene: z.literal('PLACEHOLDER'),
  revision: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  actors: z.array(z.object({ actorKey: identifier })).max(80),
  candles: z.array(z.object({ id: identifier, actorKey: identifier })).max(80),
});
export type ChurchSnapshot = z.infer<typeof ChurchSnapshotSchema>;

/** A fresh deterministic fixture, never shared mutable state. No actions in TASK-001. */
export function createInitialSnapshot(): ChurchSnapshot {
  return { schemaVersion: SCHEMA_VERSION, source: 'DEMO', scene: 'PLACEHOLDER', revision: 0, actors: [], candles: [] };
}

const commands = new Map<string, ChurchIntent>([
  ['vao nha tho', 'ENTER'], ['xin cho', 'ENTER'],
  ['cau nguyen', 'PRAY'], ['thap nen', 'LIGHT_CANDLE'],
  ['binh an', 'PEACE'], ['amen', 'AMEN'],
]);

/** Exact approved commands only. Never echo, execute, or speak the input. */
export function normalizeCommand(input: unknown): ChurchIntent | null {
  if (typeof input !== 'string' || input.length > MAX_COMMAND_LENGTH) return null;
  const normalized = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/đ/g, 'd').trim().replace(/\s+/gu, ' ');
  return commands.get(normalized) ?? null;
}
