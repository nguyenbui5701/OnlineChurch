import { describe, expect, it } from 'vitest';
import {
  ChurchIntentSchema, ChurchSnapshotSchema, createInitialSnapshot,
  EventScopeSchema, MAX_COMMAND_LENGTH, normalizeCommand, NormalizedEventSchema,
  parseScopedEvent, SourceModeSchema,
} from '@onlinechurch/shared';
import { demoEvent, demoScope } from './fixtures/events.js';

describe('pure Vietnamese command normalization', () => {
  it.each([
    ['vào nhà thờ', 'ENTER'], ['vao nha tho', 'ENTER'], ['xin chỗ', 'ENTER'], ['xin cho', 'ENTER'],
    ['cầu nguyện', 'PRAY'], ['cau nguyen', 'PRAY'], ['thắp nến', 'LIGHT_CANDLE'], ['thap nen', 'LIGHT_CANDLE'],
    ['bình an', 'PEACE'], ['binh an', 'PEACE'], ['amen', 'AMEN'], ['AMEN', 'AMEN'],
    ['  VÀO   NHÀ\tTHỜ  ', 'ENTER'], ['\n CẦU\tNGUYỆN \n', 'PRAY'],
    ['thắp nến'.normalize('NFD'), 'LIGHT_CANDLE'],
  ])('normalizes %j to %s', (input, expected) => expect(normalizeCommand(input)).toBe(expected));

  it.each([
    undefined, null, 1, {}, [], '', ' ', 'xin chao', 'không cầu nguyện', 'đừng thắp nến',
    '"amen"', 'amen thắp nến', 'amen!', 'amen<script>', 'cầu nguyện cho tôi', '__proto__',
    'constructor', 'AMEN\u0000', 'a\u200bmen', 'amen' + ' '.repeat(MAX_COMMAND_LENGTH),
  ])('safely ignores invalid or ambiguous input %j', input => expect(normalizeCommand(input)).toBeNull());
});

describe('versioned sanitized contracts', () => {
  it('accepts supported enums only', () => {
    expect(SourceModeSchema.parse('LIVE')).toBe('LIVE');
    expect(SourceModeSchema.safeParse('AUTO').success).toBe(false);
    expect(ChurchIntentSchema.safeParse('PAID_PRAY').success).toBe(false);
    expect(EventScopeSchema.safeParse({ ...demoScope, roomId: '' }).success).toBe(false);
  });
  it('uses stable event identifiers and exact room/session/source boundaries', () => {
    expect(parseScopedEvent(demoEvent, demoScope)).toEqual(demoEvent);
    expect(parseScopedEvent(demoEvent, demoScope)).toEqual(parseScopedEvent(demoEvent, demoScope));
    for (const scope of [null, { ...demoScope, roomId: 'other' }, { ...demoScope, sessionId: 'stale' }, { ...demoScope, source: 'LIVE' }]) {
      expect(parseScopedEvent(demoEvent, scope)).toBeNull();
    }
    expect(parseScopedEvent(null, demoScope)).toBeNull();
    expect(NormalizedEventSchema.parse({ ...demoEvent, kind: 'enter' })).not.toHaveProperty('intent');
  });
  it.each([
    null, {}, { ...demoEvent, schemaVersion: 2 }, { ...demoEvent, source: 'AUTO' },
    { ...demoEvent, eventId: '' }, { ...demoEvent, actorKey: '<script>' },
    { ...demoEvent, roomId: 'x'.repeat(97) }, { ...demoEvent, sessionId: '' },
    { ...demoEvent, timestamp: -1 }, { ...demoEvent, timestamp: Infinity },
    { ...demoEvent, timestamp: 1.2 }, { ...demoEvent, timestamp: Number.MAX_SAFE_INTEGER + 1 },
    { ...demoEvent, kind: 'gift' }, { ...demoEvent, intent: 'PAID_PRAY' },
    { ...demoEvent, intent: undefined },
  ])('rejects malformed envelope %j', input => expect(NormalizedEventSchema.safeParse(input).success).toBe(false));
  it('strips unknown fields at every object boundary and produces safe JSON', () => {
    const event = parseScopedEvent({ ...demoEvent, text: '<script>private</script>', cookie: 'secret', profile: { name: 'private' } }, demoScope);
    expect(JSON.parse(JSON.stringify(event))).toEqual(demoEvent);
    const state = ChurchSnapshotSchema.parse({ ...createInitialSnapshot(), future: true, actors: [{ actorKey: 'demo-actor', profile: 'private' }] });
    expect(state).not.toHaveProperty('future');
    expect(state.actors).toEqual([{ actorKey: 'demo-actor' }]);
  });
  it('creates independent deterministic snapshots without advancing revision on reads', () => {
    const initial = createInitialSnapshot();
    expect(ChurchSnapshotSchema.parse(initial)).toEqual({ schemaVersion: 1, source: 'DEMO', scene: 'PLACEHOLDER', revision: 0, actors: [], candles: [] });
    initial.actors.push({ actorKey: 'demo-actor' });
    expect(createInitialSnapshot().actors).toEqual([]);
    expect(createInitialSnapshot().revision).toBe(0);
  });
  it.each([
    { revision: -1 }, { revision: 0.1 }, { revision: Number.MAX_SAFE_INTEGER + 1 },
    { schemaVersion: 2 }, { source: 'AUTO' }, { scene: 'LIVE' }, { actors: null },
    { actors: [{ actorKey: '' }] }, { candles: [{ id: 'candle' }] },
  ])('rejects invalid snapshot %j', patch => expect(ChurchSnapshotSchema.safeParse({ ...createInitialSnapshot(), ...patch }).success).toBe(false));
});
